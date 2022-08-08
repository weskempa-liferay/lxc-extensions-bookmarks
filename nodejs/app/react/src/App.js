import React from 'react';
import './App.css';

import UserBookmark from './components/UserBookmark';
import AddBookmark from './components/AddBookmark';
import LiferayApi from './services/liferay/api';

let bookmarkUser = 0;
let siteId = 0;
let bookmarkStructureId = 0;
let userConfigurationId = 0;
let defaultbookmarks = [];
let allBookmarks = [];
let bookmarkData = [];
let articleKeys = {};

class App extends React.Component {
  
  state = {
    userBookmarks : [], 
    remainingBookmarks : [], 
    userConfiguration : ""
  }

  updateView  = () => {
    let userSetBookmarks = [];

    for(let key in this.state.userBookmarks){
      articleKeys[this.state.userBookmarks[key].id]=this.state.userBookmarks[key].title
    }

    if(this.state.userConfiguration!=""){
      let userConfig = this.state.userConfiguration;

      for (let articleId in userConfig){
        let userSetBookmark = {};
        userSetBookmark["id"]=userConfig[articleId];
        userSetBookmark["url"]=this.findUrl(userConfig[articleId]);
        userSetBookmark["title"]=articleKeys[userConfig[articleId]];
        userSetBookmarks.push(userSetBookmark);
      }
    }

    this.setState({
      userBookmarks: userSetBookmarks
    }, () => {
      this.setRemainingBookmarks(userSetBookmarks);
    });
  }

  setRemainingBookmarks = (items) => {
    let remainingBookmarks = [];
    
    for(let key in allBookmarks){
        let found = false;
        for(let innerkey in this.state.userBookmarks){
          if(this.state.userBookmarks[innerkey].title===allBookmarks[key]){
            found=true;
            break;
          }
        }
        if(!found){
          remainingBookmarks.push(allBookmarks[key]);
        }
    }

    this.setState({
      remainingBookmarks: remainingBookmarks
    });
  }

  uniqueBookmarks = (items) => {
    let uniqueBookmarksItems = [...new Set(
      items.map(
        item => item.title
      )
    )].sort((a, b) => -b.localeCompare(a));
    return uniqueBookmarksItems;
  }

  findBookmarkId = (name) => {
    for(let key in bookmarkData){
      if(bookmarkData[key].title == name)
        return bookmarkData[key].id;
    }
    return 0;
  }

  findUrl = (articleId) => {
    for(let key in bookmarkData){
      if(bookmarkData[key].id == articleId){
        return bookmarkData[key].friendlyUrlPath;
      }
    }
    return "";
  }

  handleChange = (pickedItem) => {
    let config = this.state.userConfiguration;

    config.push(this.findBookmarkId(pickedItem));
  
    this.submitBookmarkUpdate("["+config+"]");
    this.updateView();
  }

  handleDeleteItem = (pickedItem) => {
    let config = this.state.userConfiguration;
    let updatedUserBookmarks = this.state.userBookmarks;

    var index = config.indexOf(pickedItem);
    if (index !== -1) {
      config.splice(index, 1);
      updatedUserBookmarks.splice(index, 1);
    }

    this.setState({
      userBookmarks:updatedUserBookmarks
    })
    
    this.submitBookmarkUpdate("["+config.toString()+"]");
    this.updateView();
  }

  submitBookmarkUpdate = (updatedConfig) => {
    LiferayApi("o/c/userbookmarks/"+userConfigurationId,{
      method: 'PUT', 
      body: {
          "bookmarkAssociations": '{"config":'+updatedConfig+'}',
          "bookmarkUser": bookmarkUser,
          "siteId": siteId
        }
    })
    .then((result) => {
      //console.log("Updated bookmark configuration for user " + bookmarkUser + " in site " + siteId);
    })
    .catch(console.log);
  }

  createBookmarkConfig = (defaultConfig) => {
    LiferayApi("o/c/userbookmarks/scopes/"+siteId,{
      method: 'POST', 
      body: {
          "bookmarkAssociations": '{"config":['+defaultConfig+']}',
          "bookmarkUser": bookmarkUser,
          "siteId": siteId
        }
    })
    .then((result) => {
      //console.log("Added new bookmark configuration for user " + bookmarkUser + " in site " + siteId);
    })
    .catch(console.log);
  }

  componentDidMount = (prevProps) => {
    try {
      // eslint-disable-next-line no-undef
      bookmarkUser = Liferay.ThemeDisplay.getUserId();
      // eslint-disable-next-line no-undef
      siteId = Liferay.ThemeDisplay.getSiteGroupId();
      
      bookmarkStructureId = document.getElementsByTagName("lxc-bookmarks")[0].getAttribute("bookmarkstructureid");
      defaultbookmarks = JSON.parse(document.getElementsByTagName("lxc-bookmarks")[0].getAttribute("defaultbookmarks"));
    } catch (error) {
      //console.warn('Not able to find Liferay object', error);
    }

    LiferayApi("o/headless-delivery/v1.0/content-structures/"+bookmarkStructureId+"/structured-contents")
    .then((result) => {
      allBookmarks = this.uniqueBookmarks(result.data.items);
      bookmarkData = result.data.items;

      this.setState({
        userBookmarks: result.data.items 
      }, () => {
        this.updateView();
      });
    })
    .catch(console.log);

    LiferayApi("o/c/userbookmarks/scopes/"+siteId+"?filter=bookmarkUser%20eq%20"+bookmarkUser)
    .then((result) => {
      let bookmarkAssociations = defaultbookmarks;

      if(result.data.items.length){
        bookmarkAssociations = JSON.parse(result.data.items[0].bookmarkAssociations);
        userConfigurationId = result.data.items[0].id;
      } else {
        this.createBookmarkConfig(defaultbookmarks);
      }

      this.setState({
        userConfiguration: bookmarkAssociations.config
      }, () => {
        this.updateView();
      });

    })
    .catch(console.log);
  }

  render(){
      return (
        <div className="bookmark-app">
          
          {Object.entries(this.state.userBookmarks).map(([key, value], index) => {
              return (
                <UserBookmark key={index}
                id={this.state.userBookmarks[key].id} 
                title={this.state.userBookmarks[key].title}
                url={this.state.userBookmarks[key].url}
                deleteItem={this.handleDeleteItem} />
              )})}

          <AddBookmark 
              handleChange={this.handleChange}
              options={this.state.remainingBookmarks} />

        </div>
    );
  }
}

export default App;