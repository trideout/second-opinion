import React from 'react';
import ReactDOM from 'react-dom';

const App = () => {
    return (
        <div>Hello world (this is React)</div>
    );
};

// This line will render your app in the element with id 'app'.
// Ensure this element exists in your Laravel blade template.
if (document.getElementById('app')) {
    ReactDOM.render(<App />, document.getElementById('app'));
}

export default App;
