import Bootstrap from './MyTheme';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Amplify, { API, I18n } from 'aws-amplify';
import { Authenticator, Greetings, SignUp } from 'aws-amplify-react';
import Footer from './components/footer';
import SignInHeader from './components/signInHeader';
// until AWS adds support for SameSite cookie storage, use a local one implemanted to add it

Amplify.configure({
  Auth: {
      mandatorySignIn: true,
      identityPoolId: 'us-east-2:911663b5-c59d-4a47-aeb3-367bfbfc93b2', //REQUIRED - Amazon Cognito Identity Pool ID
      region: 'us-east-2', // REQUIRED - Amazon Cognito Region
      userPoolId: 'us-east-2_ivDgwUc50', //OPTIONAL - Amazon Cognito User Pool ID
      userPoolWebClientId: '6fp17oguimr6epghu3ekklqg04', //OPTIONAL - Amazon Cognito Web Client ID
  },
  API: {
    endpoints: [
      {
        name: "analytics",
        endpoint: "https://0t0amzagza.execute-api.us-east-2.amazonaws.com/dev",
      }
    ]
  }
});

// not needed?
// API.configure({
//   API: {
//     endpoints: [
//       {
//         name: "analytics",
//         endpoint: "https://0t0amzagza.execute-api.us-east-2.amazonaws.com/dev"
//       }
//     ]
//   }
// });

const dict={
  'de': {
    'Username': 'Nutzername',
    'Password': 'Passwort',
    'Forget your password? ': 'Passwort vergessen? ',
    'Reset password': 'Passwort zurücksetzen',
    'Sign in to your account': 'Bitte loggen Sie sich ein',
    'Please sign in': 'Bitte einloggen',
    'Sign In': 'Einloggen',
    'Sign Out': 'Ausloggen',
    'Back to Sign In': 'Zurück zum Login',
    'Enter your username': 'Geben Sie Ihren Benutzernamen ein',
    'Enter your password': 'Geben Sie Ihr Passwort ein',
    'Confirm TOTP Code': 'TOTP Bestätigungscode',
    'Confirm': 'Bestätigen',
    'User does not exist': 'Benutzer ist nicht vorhanden',
    'Failed to get the user session': 'Fehler beim Abrufen der Benutzersitzung',
    'Invalid code received for user': 'Ungültiger code erhalten',
    'Invalid session for the user, session is expired.': 'Ungültige Sitzung für den Benutzer, Sitzung ist abgelaufen.',
    'System Overview': 'System Übersicht',
    'Overview': 'Übersicht',
    'Specific Fault Patterns - Intervention Required': 'Spezifische Fehlerbilder - Eingriff erforderlich',
    'PPPoE Session Abnormalities': 'PPPoE Session Auffälligkeiten',
    'System Failure - Overview': 'Systemausfall - Übersicht',
    'Vectoring Recovery Repeater': 'Vectoring Recovery Wiederholer',
    'Degraded Vectoring Systems - Overview': 'Degraded Vectoring Systeme - Übersicht',
    'Systems with Multi-Retrains and Togglers': 'Systeme mit vielen und blockweisen Retrains',
    'View': 'View',
    'Overview of the context of the scan.': 'Übersicht über den Kontext des Scans.',
    'KPI - Degraded Vectoring Systems.': 'KPI - Degraded Vectoring Systeme',
    'Silent ports caused by inserted front link loopback.': 'Silent Ports verursacht durch eingelegten Frontlink Loopback.',
    'PPPoE sessions in relation to active ports.': 'PPPoE Sessions im Verhältnis zu aktiven Ports.',
    'KPI - Systems with a noticeable number of multi-port retrains.': 'KPI - Systeme mit auffällig vielen Multi-Port Retrains.',
    'Vectoring Recovery Overview': 'Vectoring Recovery Übersicht',
    'Stopped ES Processing': 'ES Verarbeitung gestört',
    'Systems with terminated ES processing thread.': 'Systeme mit terminiertem ES Verarbeitungsthread',
    'ADTRAN is a leading global provider of networking and communications equipment. Our products enable voice, data, video, and Internet communications across a variety of network infrastructures. Our solutions are currently in use by service providers, private enterprises, government organizations, and millions of individual users worldwide.':'ADTRAN ist ein weltweit führender Anbieter von Netzwerk- und Kommunikationsgeräten. Unsere Produkte ermöglichen Sprach-, Daten-, Video- und Internetkommunikation über eine Vielzahl von Netzwerkinfrastrukturen. Unsere Lösungen werden derzeit von Service Providern, privaten Unternehmen, Regierungsorganisationen und Millionen einzelner Benutzer weltweit eingesetzt.',
    'By clicking SIGN IN above, you are agreeing to the terms of our ': 'Wenn Sie oben auf "Einloggen" klicken, stimmen Sie den Bedingungen unserer '
  }
};
I18n.putVocabularies(dict);

const page = (
  <Authenticator theme={Bootstrap} hide={[Greetings, SignUp]}>
    <SignInHeader/>
    <App/>
    <Footer/>
  </Authenticator>
);

ReactDOM.render(page, document.getElementById('root'));
