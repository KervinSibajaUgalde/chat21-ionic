export const environment = {
    tenant: 'tilechat',
    supportMode: true,
    CHAT_SEND_BY_EMAIL_LINK: 'mailto:?subject=Transcripcion de la conversacion del chat&body=Hola,%0D%0A%0D%0Aaqui esta la transcripcion:%0D%0A%0D%0Ahttps://tiledesk.solucionesinduso.com/api/public/requests/',
    FIREBASESTORAGE_BASE_URL_IMAGE: 'https://firebasestorage.googleapis.com/v0/b/',
    DASHBOARD_URL: 'http://localhost:8080/',
    SERVER_BASE_URL: 'http://localhost:3000/',
    production: false,
    remoteConfig: false,
    remoteConfigUrl: './chat-config.json',
    firebaseConfig: {
        apiKey: 'AIzaSyCCXlqBMquWntJLBseu6qNTM-mTrMfYFW8',
        authDomain: 'tiledesk-facture-dev.firebaseapp.com',
        databaseURL: 'https://tiledesk-facture-dev-default-rtdb.firebaseio.com',
        projectId: 'tiledesk-facture-dev',
        storageBucket: 'tiledesk-facture-dev.appspot.com',
        messagingSenderId: '82084183603',
        appId: '1:82084183603:web:d04b7e390ddd2d8b342d46',
        chat21ApiUrl: 'https://us-central1-tiledesk-facture-dev.cloudfunctions.net'
    }
}