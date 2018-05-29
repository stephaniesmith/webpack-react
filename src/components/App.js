import React, { Component } from 'react';
import cowsay from 'cowsay-browser';
import dom2image from 'dom-to-image';
import fileSaver from 'file-saver';

let cows = null;
cowsay.list((err, _cows) => {
  cows = _cows;
});

export default class App extends Component {

  constructor() {
    super();

    this.state = {
      cows,
      selected: 'default',
      name: 'Portland',
      color: '#0000000',
      image: null
    };
  }

  handleNameChange({ target }) {
    this.setState({ name: target.value });
  }

  handleColorChange({ target }) {
    this.setState({ color: target.value });
  }

  handleCowChange({ target }) {
    this.setState({ selected: target.value });
  }

  handleImageSrc({ target }) {
    this.setState({ image: target.value });
  }

  handleUpload({ target }) {
    const reader = new FileReader();

    reader.readAsDataURL(target.files[0]);

    reader.onload = () => {
      this.setState({ image: reader.result });
    };
  }

  handleExport() {
    dom2image.toBlob(this.imageExport).then(blob => {
      fileSaver.saveAs(blob, 'cute-image.png');
    });
  }
    
  render() {
    const { cows, selected, name, color, image } = this.state;

    const cowSaid = cowsay.say({
      text: name,
      f: selected
    });

    return (
      <main>
        <h1>Hello React</h1>
        <fieldset>
          <div>
            <label>
                            Text:
              <input 
                value={name} 
                onChange={event => this.handleNameChange(event)}
              />
              <input
                type="color"
                value={color}
                onChange={event => this.handleColorChange(event)}
              />
            </label>
          </div>
          <div>
            <select 
              value={selected} 
              onChange={event => this.handleCowChange(event)}>
              {cows.map(cow=> <option key={cow}>{cow}</option>)}
            </select>
          </div>
        </fieldset>
        <pre style={{ color }}>{cowSaid}</pre>

        <section>
          <div>
            <label>
                Image Src:
              <input onChange={event => this.handleImageSrc(event)} Update Image/>
            </label>
          </div>
          <div>
            <label>
                Image:
              <input 
                type="file"
                onChange={event => this.handleUpload(event)}
              />
            </label>
          </div>

          <div>
            <button onClick={() => this.handleExport()}>Export</button>
          </div>

          <div className="image-container" ref={node => this.imageExport = node}>
            <h1>What an image!</h1>
            <img src={image}/>
          </div>
        </section>
      </main>
    );
  }
}