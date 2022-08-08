import React from 'react';
import Card from '@mui/material/Card';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';

class UserBookmark extends React.Component {

    handleNavigate  = (e) => {
        e.stopPropagation();
        window.location.href='/w/'+this.props.url;
    }

    handleDeleteClick  = (e) => {
        e.stopPropagation();
        this.props.deleteItem(this.props.id);
    }

    render() {

        return <Card key={this.props.id} variant="outlined"  onClick={this.handleNavigate}>
            <div className="flex-row" id={this.props.id}>
                <div>
                    <h3>{this.props.title}</h3>
                </div>
                <div>
                    <Button onClick={this.handleDeleteClick}  id={this.props.id}>
                        <DeleteIcon/>
                    </Button>
                </div>
            </div>
        </Card>;
    }
}

export default UserBookmark;