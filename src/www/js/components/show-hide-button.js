var React = require('react');
var ReactDOM = require('react-dom');

export class ShowHideButton extends React.Component {
  constructor(props) {
    super(props);

    var stateClass = "show-hide state-shown";
    var triggerText = this.props.hideText;

    if (this.props.startClosed === "true") {
      triggerText = this.props.showText,
      stateClass = "show-hide state-hidden"
    }

    this.state = {
      triggerText : triggerText,
      stateClass : stateClass
    };
    this.showHide = this.showHide.bind(this);
  };

  showHide (e) {
    var elem = document.querySelector(this.props.target);
    var triggerText = this.props.hideText;
    var stateClass = "";

    if (e.target.className.indexOf('state-shown') > -1) {
      elem.className = elem.className.replace(/height-normal/g, '');
      elem.className += ' height-zero ';
      stateClass = e.target.className.replace(/state-shown/g, 'state-hidden');
      triggerText = this.props.showText;
    } else {
      elem.className = elem.className.replace(/height-zero/g, '');
      elem.className += ' height-normal ';
      stateClass = e.target.className.replace(/state-hidden/g, 'state-shown');
      triggerText = this.props.hideText;
    }

    this.setState({
      triggerText : triggerText,
      stateClass : stateClass
    });
  }

  render() {
    return <span className={this.state.stateClass} onClick={this.showHide}>{this.state.triggerText}</span>
  }
}
