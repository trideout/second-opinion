import React from 'react';
import { createRoot } from 'react-dom/client';
import { Chat } from './Chat';
import '../css/app.css';
import '@fontsource/inter/300.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'

const App = () => {
    return (
        <Chat></Chat>
    );
};

if (document.getElementById('app')) {
    createRoot(document.getElementById('app'))
      .render(<App />);
}

export default App;
