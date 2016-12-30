var React = require('react');
var ReactDOM = require('react-dom');
import { SubmitButton } from '../../../../node_modules/simple-react-forms/form-fields/submit-button.js';

export class CardSizeButton extends React.Component {
  constructor(props) {
    super(props);

    this.updateSize = this.updateSize.bind(this);
  };

  updateCardSize(size) {
    var cards = document.querySelector('.spell-card-container');

    cards.setAttribute("data-card-size", size);
  }
  
  updateSize(e) {
    let size = e.target.innerHTML;
    let active = document.querySelector(".size-buttons .btn.active");
    let buttons = document.querySelectorAll(".size-buttons");

    if (e.target.className.indexOf("active") > -1) {
      e.target.className = "btn";
      size = "";
    } else if (active) {
      active.className = active.className.replace(/active/g,"");
      e.target.className += " active";
    } else {
      e.target.className += " active";
    }

    this.updateCardSize(size);
  }

  render() {
    return <div className="size-buttons">
             <SubmitButton cssClass="sm" label="sm" onUpdate={this.updateSize} />
             <SubmitButton cssClass="md" label="md" onUpdate={this.updateSize} />
             <SubmitButton cssClass="lg" label="lg" onUpdate={this.updateSize} />
             <SubmitButton cssClass="xl" label="xl" onUpdate={this.updateSize} />
           </div>
  }
}
