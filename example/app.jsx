import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import SignaturePad from '../src';

import styles from './styles.cssm';

class App extends Component {
  sigPad = {};

  constructor(props) {
    super(props);
    this.state = { trimmedDataURL: null };
  }

  clear = () => {
    this.sigPad.clear();
  };

  trim = () => {
    this.setState({
      trimmedDataURL: this.sigPad.getTrimmedCanvas()
        .toDataURL('image/png'),
    });
  };

  render() {
    const { trimmedDataURL } = this.state;
    return (
      <div className={styles.container}>
        <div className={styles.sigContainer}>
          <SignaturePad
            canvasProps={{ className: styles.sigPad }}
            ref={(ref) => { this.sigPad = ref; }}
          />
        </div>
        <div>
          <button type="button" className={styles.buttons} onClick={this.clear}>
            Clear
          </button>
          <button type="button" className={styles.buttons} onClick={this.trim}>
            Trim
          </button>
        </div>
        {trimmedDataURL
          ? (
            <img
              alt="signature"
              className={styles.sigImage}
              src={trimmedDataURL}
            />
          )
          : null}
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('container'));
