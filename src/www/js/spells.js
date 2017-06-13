var React = require('react');
var ReactDOM = require('react-dom');
var utilities = require("../../../node_modules/simple-react-utilities/js/utilities.js");

import cardData from '../json/spells.json';
import filterOptions from '../json/filter-configs.json';
import Filter from '../../../node_modules/card-filters/src/www/js/filter.js';
import { CardBook } from '../../../node_modules/card-filters/src/www/js/cards.js'
import { Card } from '../../../node_modules/card-filters/src/www/js/components/card.js'
import { FilterButtonGroup } from '../../../node_modules/card-filters/src/www/js/components/filter-button-group.js';
import { FilterButton } from '../../../node_modules/card-filters/src/www/js/components/filter-button.js';
import { TextInput } from '../../../node_modules/simple-react-forms/form-fields/text-input.js';

class SpellBook extends React.Component {
  /**
   * constructor for CardBook
   * @param  {object} props [element properties/attributes passed in at initialization]
   */
  constructor(props) {
    super(props);

    this.searchFilter = this.searchFilter.bind(this);
  }
  
  searchFilter(activate,deactivate) {
    var filter = new Filter(cardData);
    var _this = this;

    var searchOptions = {
      filterName : "level",
      filterFunc : filter.by.search, 
      onActivate : activate, 
      onDeactivate : deactivate
    }

    function update(e) {
      if (typeof activate === "function") {
        activate('search',{filterFunc : filter.by.search, filterArgs : [true, e.target.value]}); // TODO: this boolean indicates description search
      }
    }

    function clearInput() {
      let inputElem = document.querySelector('.form-control');
      inputElem.value = "";
      activate('search',{filterFunc : filter.by.search, filterArgs : [true, ""]}); // TODO: this boolean indicates description search
    }

    return <div className="filterByText-wrapper">
            <TextInput className="filterByText" label="Search" type="search" name="filterByText" onChange={update} />
            <div className="clear-input" onClick={clearInput}>x</div>
           </div>
  }

  classFilters(activate,deactivate) {
    var filter = new Filter(cardData);
    var buttonOptions = {
      filterName : "class",
      filterFunc : filter.by.subProp("class").value, 
      onActivate : activate, 
      onDeactivate : deactivate // stopFilteringBy(filterName, filterObj)
    }

    return  <div>
              <h4>Class</h4>
              <FilterButtonGroup cardData={cardData} buttonOptions={buttonOptions} filters={filterOptions.class} />
            </div>
  }


  levelFilters(activate,deactivate) {
    var filter = new Filter(cardData);
    var buttonOptions = {
      filterName : "level",
      filterFunc : filter.by.value, 
      onActivate : activate, 
      onDeactivate : deactivate
    }

    return  <div>
              <h4>Level</h4>
              <FilterButtonGroup cardData={cardData} buttonOptions={buttonOptions} filters={filterOptions.level} />
            </div>
  }

  sourceFilters(activate,deactivate) {
    var filter = new Filter(cardData);
    var buttonOptions = {
      filterName : "page",
      filterFunc : filter.by.match, 
      onActivate : activate, 
      onDeactivate : deactivate
    }

    return  <div>
              <h4>Source</h4>
              <FilterButtonGroup cardData={cardData} buttonOptions={buttonOptions} filters={filterOptions.source} />
            </div>
  }

  castingTimeFilters(activate,deactivate) {
    var filter = new Filter(cardData);
    var buttonOptions = {
      filterName : "casting_time",
      filterFunc : filter.by.value, 
      onActivate : activate, 
      onDeactivate : deactivate
    }

    return  <div>
              <h4>Casting Time</h4>
              <FilterButtonGroup cardData={cardData} buttonOptions={buttonOptions} filters={filterOptions.casting_time} />
            </div>
  }

  rangeFilters(activate,deactivate) {
    var filter = new Filter(cardData);
    var buttonOptions = {
      filterName : "range",
      filterFunc : filter.by.value, 
      onActivate : activate, 
      onDeactivate : deactivate
    }

    return  <div>
              <h4>Range</h4>
              <FilterButtonGroup cardData={cardData} buttonOptions={buttonOptions} filters={filterOptions.range} />
            </div>
  }

  componentFilters(activate,deactivate) {
    var filter = new Filter(cardData);
    var buttonOptions = {
      filterName : "components",
      filterFunc : filter.by.match, 
      onActivate : activate, 
      onDeactivate : deactivate
    }

    return  <div>
              <h4>Components</h4>
              <FilterButtonGroup cardData={cardData} buttonOptions={buttonOptions} filters={filterOptions.components} />
            </div>
  }

  durationFilters(activate,deactivate) {
    var filter = new Filter(cardData);
    var buttonOptions = {
      filterName : "duration",
      filterFunc : filter.by.value, 
      onActivate : activate, 
      onDeactivate : deactivate
    }

    return  <div>
              <h4>Duration</h4>
              <FilterButtonGroup cardData={cardData} buttonOptions={buttonOptions} filters={filterOptions.duration} />
            </div>
  }

  schoolFilters(activate,deactivate) {
    var filter = new Filter(cardData);
    var buttonOptions = {
      filterName : "school",
      filterFunc : filter.by.value, 
      onActivate : activate, 
      onDeactivate : deactivate
    }

    return  <div>
              <h4>School</h4>
              <FilterButtonGroup cardData={cardData} buttonOptions={buttonOptions} filters={filterOptions.school} />
            </div>
  }

  optionsFilters(activate,deactivate) {
    var filter = new Filter(cardData);
    var buttonOptions = {
      filterName : "school",
      filterFunc : filter.by.match,
      onActivate : activate, 
      onDeactivate : deactivate
    }
    var i = 0;

    return  <div>
              <h4>Options</h4>
              {filterOptions.options.map((option) => {
                i++;
                return <FilterButton key={i}
                label={option.label}
                filterArgs={option.filterArgs}
                buttonOptions={buttonOptions}
              />
              })}
            </div>
  }

  renderCards(cardsData) {
    var i = 0;
    var cardsArr = cardsData || [];
    var cards = <div className="row card-container">{cardsArr.map(card => <div className="card card-inner col-xs-12 col-sm-6 col-md-4" key={card.name}><Card settings={{
                        name : card.name,
                        description : card.description,
                        col1Props : [
                          {
                            cssClass : 'card_level',
                            label : 'Level',
                            value : card.level 
                          },
                          {
                            cssClass : 'card_casting_time',
                            label : 'Casting Time',
                            value : card.casting_time 
                          },
                          {
                            cssClass : 'card_duration',
                            label : 'Duration',
                            value : card.duration 
                          },
                          {
                            cssClass : 'card_range',
                            label : 'Range',
                            value : card.range 
                          },
                          {
                            cssClass : 'card_components',
                            label : 'Components',
                            value : card.components 
                          }
                        ],
                        col2Props : [
                          {
                            cssClass : 'card_concentration',
                            label : 'Concentration',
                            value : card.concentration 
                          },
                          {
                            cssClass : 'card_ritual',
                            label : 'Ritual',
                            value : card.ritual 
                          },
                          {
                            cssClass : 'card_page',
                            label : 'Page',
                            value : card.page 
                          },
                          {
                            cssClass : 'card_school',
                            label : 'School',
                            value : card.school 
                          },
                          {
                            cssClass : 'card_class',
                            label : 'Class',
                            value : getClassNames(card) 
                          }
                        ]
                     }} /></div>)}
              </div>;
    
    function getClassNames(cardObj) {
      var classes = cardObj.class;
      var classArray = [];

      for (var obj in classes) {
        classArray.push(obj);
      }

      return classArray.join(", ");
    }


    if (!cardsData || cardsData.length === 0) {
      cards = <div className="card-container col-xs-12"><h4 className="no-cards">No cards matching the selected filters</h4></div>
    }

    return cards;
  }
  
  /**
   * puts everything in the DOM
   */
  render() {

    return  <div className="container">
              <CardBook 
                label="Spells"
                cardData={cardData}
                navigation={function(){}}
                searchFilter={this.searchFilter}
                filters={[this.classFilters, this.levelFilters]}
                renderCards={this.renderCards}
                advancedFilters={[this.componentFilters,this.optionsFilters,this.schoolFilters,this.durationFilters,this.castingTimeFilters,this.rangeFilters,this.sourceFilters]}
              />
            </div>;
  }
}

ReactDOM.render(<SpellBook />, document.querySelector('main'));
