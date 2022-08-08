import React from 'react';
import Card from '@mui/material/Card';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

class AddBookmark extends React.Component {

  state = {
    addToggle : true,
    selectedItem : ""
  }

  toggleAdd  = (e) => {
    e.stopPropagation();
    this.setState({
      addToggle:!this.state.addToggle
    });
  }

  updateItem  = (newValue) => {

    this.setState({
        addToggle:true,
        selectedItem:""
    });

    this.props.handleChange(newValue);
  }

  render() {

    return <Card variant="outlined" className="add-area" >
            <div className={this.state.addToggle ? null : "hidden"}>
                <Button 
                    onClick={this.toggleAdd}>
                    <AddIcon/>
                </Button>
            </div>
            <Autocomplete  className={this.state.addToggle ? "hidden" : null}
              label="Choose a bookmark"
              options={this.props.options}
              value={this.state.selectedItem}
              onChange={(event, newValue) => {
                this.updateItem(newValue)
              }}
              renderInput={(params) => <TextField {...params} label="Choose a bookmark" />}
            />
        </Card>;
  }
}

export default AddBookmark;