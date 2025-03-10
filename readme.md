# 1984

1984 is a tool built for [CID Karnataka](https://cidecode.in/hackathon/) which leverages Bluetooth Low Energy (BLE) protocol. It enables wireless evidence collection, secure storage, and automated chain-of-custody tracking. Built with scalability in mind, the platform serves as a single point for managing current and future forensic services, enhancing investigative efficiency and evidence credibility.

## Features

- **Real-Time BLE Collection:** Wirelessly extract data from devices like smartphones, earbuds and other bluetooth devices at the crime scene.

- **Secure Evidence Storage:** Protect data with digital signatures to ensure tamper-proof integrity.

- **Duplicate Prevention:** Ensure unique device entries with database-level checks.

- **Modular Design:** Expandable to integrate future services like Wi-Fi forensics or cloud extraction.

- **User-Friendly Interface:** Intuitive dashboard for managing evidence with minimal training.

## Tech Stack

- **Backend:** Node.js, Express.js, MongoDB
- **Frontend:** React, Material-UI
- **Microservice:** Flask, Bleak
- **Authentication:** JSON Web Tokens (JWT)

## Run Locally

1 - Clone the project
```bash
  git clone https://github.com/your-username/ble-evidence-platform.git
  cd ble-evidence-platform
```

2 - Install dependencies
- Backend
```bash
  cd backend
  npm install
```
- Frontend
```bash
  cd frontend
  npm install
```
- Microservice
```bash
  cd BLE/microservice
  pip install -r requirements.txt
```

3 - Configure Environment
- Create .env files
  #### backend/.env
  ```bash
  MONGO_URI=mongodb://localhost:27017/ble_evidence
  JWT_SECRET=your_jwt_secret
  FLASK_API_URL=http://localhost:5002
  ```
  #### BLE/microservice/.env
  ```bash
  FLASK_PORT=5002
  ```

4 - Start MongoDB
- Ensure MongoDB is running locally: (if you are on unix system and have installed mongodb using brew)
```bash
  brew services start mongodb-community
```

5 - Run the Application
- Backend (do check package.json)
```bash
  cd backend
  npm run dev
```
- Frontend (do check package.json)
```bash
  cd frontend
  npm run dev
```
- Microservice
```bash
  cd BLE/microservice
  python app.py
```

## Acknowledgements

- [CID Karnataka](https://cidecode.in/hackathon/)
- [Bleak](https://github.com/hbldh/bleak)

## Contributors
- [Abhi](https://github.com/abhinandan1016)
- [Ginny](https://github.com/ginnysingh789)
- [Iqra](https://github.com/IqraBashir-04)
- [Saqib](https://github.com/saqib40)