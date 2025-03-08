import asyncio
from bleak import BleakScanner

async def main():
    devices = await BleakScanner.discover()
    for d in devices:
        print(d)

asyncio.run(main())

# this script works
# but due to privacy realted reasons
# on Mac OS reads 
# UUID : Device Name
# on Linux
# MAC ADDRESS : Device Name