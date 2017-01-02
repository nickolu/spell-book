var React = require('react');
var ReactDOM = require('react-dom');
var utilities = require("../../../../node_modules/simple-react-utilities/js/utilities.js");

import { SubmitButton } from '../../../../node_modules/simple-react-forms/form-fields/submit-button.js';

/**
 * makes a button that filters the state by specified key and value
 * @param  {string} key   [key to search]
 * @param  {string} val   [value to search]
 * @param  {string} label [label for the button]
 */
export class FilterButton extends React.Component {
  constructor(props) {
    super(props);

    this.filter = this.filter.bind(this);
  };

  filter(e) {
    var spells = [];
    var usePartialMatch = this.props.usePartialMatch || false;
    var filter = {
      "key" : this.props.prop,
      "value" : this.props.val,
      "usePartialMatch" : usePartialMatch
    };

    if (e.target.className.indexOf("active") > -1) {
      e.target.className = e.target.className.replace(/active/g,'');

      this.props.context.setState({
        spells : utilities.sortObjectsByProp(this.props.data, "name"),
        filter : utilities.removeObject(this.props.context.state.filter,filter)
      });

    } else {
      e.target.className += " active";
      this.props.context.state.filter.push(filter);
    }


    this.props.onUpdate(e);
  }

  render() {
    var label = this.props.label || this.props.val;

    return <SubmitButton label={this.props.label} onUpdate={this.filter} />
  }
}
