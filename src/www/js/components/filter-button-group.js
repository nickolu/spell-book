var React = require('react');
var ReactDOM = require('react-dom');
var utilities = require("../../../../node_modules/simple-react-utilities/js/utilities.js");

import { ButtonGroup } from '../../../../node_modules/simple-react-forms/form-fields/button-group.js';

/**
 * renders a group of buttons which filter the spells by a key and list of options
 * @param  {string}   key           the value for the spell filter key ("class","level","school", etc)
 * @param  {array}    choices       list of options for the provided key
 * @param  {boolean}  multiSelect   whether to allow multiple options to be selected at one time
 * @return {ButtonGroup}            <ButtonGroup /> element to render
 */
export class FilterButtonGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timesSet : 0
    }

    this.filter = this.filter.bind(this);
  };

  

  filter(e,choice,isActive) {
      var activeBtns = document.querySelectorAll("."+this.props.prop+".btn.active");
      var val = typeof choice === "string" ? choice : choice.val;
      var i = 0;
      var removeFilter = {};
      var addFilter = {
        "key" : this.props.prop,
        "value" : val,
        "usePartialMatch" : this.props.usePartialMatch || false
      };

      if (this.props.type) {
        addFilter.type = this.props.type;
      }

      if (isActive) {
        // the button was active when clicked, so make it unactive and remove its filter
        this.props.context.setState({
          spells : utilities.sortObjectsByProp(this.props.data, "name"),
          filter : utilities.removeObject(this.props.context.state.filter,addFilter)
        });

        this.setState({
          timesSet : this.state.timesSet - 1
        });

      } else if (!this.props.multiSelect) {
        // the button was not active and multiSelect is off, so switch the active button, remove the old filter, and add this one

        for (i=0; i<activeBtns.length; i++) {
          if (!(activeBtns[i].innerHTML === addFilter.value)) {
            removeFilter = utilities.getObjectsByProp(this.props.context.state.filter, "value", activeBtns[i].getAttribute("data-key"))[0];
          }
        }

        this.props.context.setState({
          spells : this.props.context.state.spells,
          filter : utilities.removeObject(this.props.context.state.filter,removeFilter)
        });

        this.props.context.state.filter.push(addFilter);
      } else {
        // the button was not active and multiSelect is on, so just add the filter for whichever button was clicked
        this.props.context.state.filter.push(addFilter);
      }

      
      console.log(this.state);
      this.props.onUpdate(e);
    }

  render() {
    return <ButtonGroup choices={this.props.choices} groupLabel={this.props.prop} onUpdate={this.filter} multiSelect={this.props.multiSelect}/>
  }
}
