from flask import Flask, jsonify, request
from flask_cors import CORS
import asyncio
from bleak import BleakScanner, BleakClient
import os
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app, resources={r"/ble/*": {"origins": "*"}})
load_dotenv()

# Helper function to convert device details to a dictionary
def device_details_to_dict(device):
    dict_ = {
        'address': None,
        'name': None,
        'details': None,
        'metadata': None,
        'rssi': None
    }
    try:
        dict_['address'] = device.address
        dict_['name'] = device.name if device.name else None
        if hasattr(device, 'details') and device.details:
            dict_['details'] = str(device.details)
        if hasattr(device, 'advertisement') and device.advertisement:
            advertisement = device.advertisement
            dict_['rssi'] = advertisement.rssi if advertisement.rssi is not None else None
            metadata = {
                'uuids': advertisement.service_uuids if advertisement.service_uuids else [],
                'manufacturer_data': {}
            }
            if advertisement.manufacturer_data:
                for company_id, data in advertisement.manufacturer_data.items():
                    metadata['manufacturer_data'][company_id] = data.hex()
            dict_['metadata'] = metadata
        else:
            dict_['metadata'] = {}
            dict_['rssi'] = None
    except Exception as e:
        print(f"Error extracting details for device {device}: {e}")
    return dict_

# Async function to get services and characteristics for a device
async def get_device_services(device, timeout_per_device):
    try:
        temp_device = await BleakScanner.find_device_by_address(device.address, timeout=timeout_per_device / 2)
        if not temp_device:
            return {'error': f'Device {device.address} not found during reconnection'}

        async with BleakClient(temp_device, timeout=timeout_per_device) as client:
            if not client.is_connected:  # Changed to property
                return {'error': f'Failed to connect to {device.address}'}

            services_data = []
            for service in client.services:
                characteristics = []
                for char in service.characteristics:
                    char_data = {
                        'uuid': char.uuid,
                        'description': char.description,
                        'handle': char.handle,
                        'properties': char.properties
                    }
                    try:
                        if 'read' in char.properties:
                            value = await client.read_gatt_char(char.uuid)
                            char_data['value'] = value.hex() if value else None
                        else:
                            char_data['value'] = None
                    except Exception as e:
                        char_data['value'] = None
                        print(f"Failed to read characteristic {char.uuid} for {device.address}: {e}")
                    characteristics.append(char_data)
                
                services_data.append({
                    'description': service.description,
                    'uuid': str(service.uuid),
                    'characteristics': characteristics
                })
            return {'services': services_data}
    except asyncio.TimeoutError:
        return {'error': f'Timeout connecting to {device.address}'}
    except Exception as e:
        return {'error': f'Error connecting to {device.address}: {str(e)}'}

# Main BLE scan and extraction function
async def scan_and_extract(is_isolated=False, total_timeout=60000):
    try:
        # Cap discovery timeout at 30s to avoid bleak issues
        discover_timeout = min(total_timeout / 2000, 30)  # Half of total, max 30s
        print(f"Scanning for Bluetooth LE devices: isolated={is_isolated}, total_timeout={total_timeout}ms, discover_timeout={discover_timeout}s")
        
        devices = await BleakScanner.discover(timeout=discover_timeout)
        if not devices:
            print("No devices found during discovery")
            return {'devices': []}

        result = []
        # Remaining time for service analysis, capped per device
        remaining_timeout_s = (total_timeout / 1000) - discover_timeout
        max_per_device_s = min(remaining_timeout_s / max(len(devices), 1), 10)  # Cap at 10s per device

        for i, device in enumerate(devices):
            print(f"Processing device {i + 1}/{len(devices)}: {device.address}")
            device_data = device_details_to_dict(device)
            services_result = await get_device_services(device, max_per_device_s)
            
            if 'error' in services_result:
                device_data['error'] = services_result['error']
            else:
                device_data.update(services_result)
            
            result.append(device_data)
            if is_isolated:
                print(f"Isolated mode: stopping after {device.address}")
                break

        print(f"Scan completed with {len(result)} devices")
        return {'devices': result}
    except Exception as e:
        print(f"Scan failed: {str(e)}")
        return {'error': f'Scan failed: {str(e)}'}

@app.route('/ble/scan', methods=['OPTIONS', 'POST'])
def ble_scan():
    if request.method == 'OPTIONS':
        response = jsonify({'message': 'CORS preflight successful'})
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Methods"] = "POST, OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "Authorization, Content-Type"
        return response, 200

    data = request.get_json() or {}
    is_isolated = data.get('isolated', False)
    total_timeout = data.get('timeout', 60000)  # Default 60s in ms
    
    try:
        print(f"Received BLE scan request: isolated={is_isolated}, timeout={total_timeout}ms")
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        result = loop.run_until_complete(scan_and_extract(is_isolated, total_timeout))
        loop.close()
        if 'error' in result:
            return jsonify(result), 500 if 'scan failed' in result['error'].lower() else 400
        return jsonify(result), 200
    except RuntimeError as e:
        return jsonify({'error': f'Event loop error: {str(e)}'}), 500
    except Exception as e:
        return jsonify({'error': f'Failed to process BLE scan: {str(e)}'}), 500
    finally:
        if 'loop' in locals() and not loop.is_closed():
            loop.close()

if __name__ == '__main__':
    port = int(os.getenv('FLASK_PORT', 5002))
    app.run(host='0.0.0.0', port=port, debug=True)