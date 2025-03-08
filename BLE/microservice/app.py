from flask import Flask, jsonify, request
import asyncio
from bleak import BleakScanner, BleakClient
import os
from dotenv import load_dotenv

app = Flask(__name__)
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
        # Handle macOS CBPeripheral details
        if hasattr(device, 'details') and device.details:
            dict_['details'] = str(device.details)  # Convert tuple to string for simplicity
        dict_['metadata'] = device.metadata if hasattr(device, 'metadata') else {}
        dict_['rssi'] = device.rssi if hasattr(device, 'rssi') else None
    except Exception as e:
        print(f"Error extracting details for device {device}: {e}")
    return dict_

# Async function to get services and characteristics for a device
async def get_device_services(device):
    try:
        temp_device = await BleakScanner.find_device_by_address(device.address, timeout=10)
        if not temp_device:
            return {'error': f'Device {device.address} not found during reconnection'}

        async with BleakClient(temp_device, timeout=20) as client:
            if not client.is_connected():
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
                    # Attempt to read characteristic value
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
    except asyncio.exceptions.TimeoutError:
        return {'error': f'Timeout connecting to {device.address}'}
    except Exception as e:
        return {'error': f'Error connecting to {device.address}: {str(e)}'}

# Main BLE scan and extraction function
async def scan_and_extract(is_isolated=False):
    try:
        print("Scanning for Bluetooth LE devices...")
        devices = await BleakScanner.discover(timeout=10)
        if not devices:
            return {'error': 'No devices found'}

        result = []
        for device in devices:
            device_data = device_details_to_dict(device)
            print(f"Processing device: {device.address}")

            # Get services and characteristics
            services_result = await get_device_services(device)
            if 'error' in services_result:
                device_data['error'] = services_result['error']
                result.append(device_data)
                if is_isolated:
                    break  # Stop after first device in isolated mode
                continue  # Move to next device in crowded mode

            device_data.update(services_result)
            result.append(device_data)
            if is_isolated:
                break  # Only process first device in isolated mode

        return {'devices': result}
    except Exception as e:
        return {'error': f'Scan failed: {str(e)}'}

@app.route('/ble/scan', methods=['POST'])
async def ble_scan():
    data = request.get_json() or {}
    is_isolated = data.get('isolated', False)
    
    result = await scan_and_extract(is_isolated)
    if 'error' in result:
        return jsonify(result), 500 if 'scan failed' in result['error'].lower() else 400
    return jsonify(result), 200

if __name__ == '__main__':
    port = int(os.getenv('FLASK_PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=True)