// import {SearchBar} from "components/searchBar.jsx";
// import {GridView} from "react-gridview";
class SearchBar extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    console.log("Searching for the keyword: " + e.target.value)
    this.props.handleChange(e.target.value);
  }

  render() {
    return (
      <div>
        Arama Yap
        <input style={{ marginLeft: "5px" }} onChange={this.handleChange} placeHolder="Yemek Adına Göre" />
      </div>
    );
  }
}

class SectionView extends React.Component {
  constructor(props) {
    super(props);

    this.theme = { GRID: "grid", LIST: "list" };

    this.section_name = props.section_name;
    //console.log("SectionView: section_name" + this.section_name);
  }

  render() {

    this.item_list = this.props.item_list;
    //console.log("Item list: " + JSON.stringify(this.item_list));
    if (this.item_list.length == 0) {
      const menu_items_view = <b>No Results Found.</b>
      return (
        <div>
          <h3>{this.section_name}</h3>
          <hr
            style={{
              color: "black",
              backgroundColor: "black",
              height: 2
            }}
          />
          {menu_items_view}
        </div>
      );
    } else if (this.props.theme == this.theme.LIST) {
      const menu_items_view = this.item_list.map((item) =>
        <MenuItem menu_item_details={item}
          key={item.id}
          handleFav={this.props.handleFav}
          handleUnfav={this.props.handleUnfav}
          theme={this.props.theme}
        />
      )
      // return (
      //   <div class="row">
      //     <div class="col-md-12">

      //     </div>
      //   </div>
      // );
      return (
        <div>
          <h3>{this.section_name}</h3>
          <hr
            style={{
              color: "black",
              backgroundColor: "black",
              height: 2
            }}
          />
          {menu_items_view}
        </div>
      );
    } else {
      // Then the theme is GRIDVIEW
      const menu_items_view = this.item_list.map((item, index) => {
        let style = { display: "inline-block", textAlign: "center" };
        return (
          <div style={style}>
            <MenuItem menu_item_details={item}
              key={item.id}
              handleFav={this.props.handleFav}
              handleUnfav={this.props.handleUnfav}
              theme={this.props.theme}
            />
          </div>
        );
      });
      return (
        <div>
          {menu_items_view}
        </div>
      )
    }
  }
}

class MenuItem extends React.Component {
  constructor(props) {
    super(props);

    this.details = props.menu_item_details;
    console.log(JSON.stringify(this.details.item))

    // Get the image of the item
    if (this.details.item.images.length !== 0) {
      this.img_src = this.details.item.images[0]["200"]
    } else {
      // this.img_src = "https://omegamma.com.au/wp-content/uploads/2017/04/default-image.jpg";
      this.img_src = ""
    }

    // Arrange ingredients part
    this.ingredients_arranged = ""
    this.details.item.ingredients.forEach((ingredient, index) => {
      if (index == 0) {
        this.ingredients_arranged = ingredient;
      } else {
        this.ingredients_arranged = this.ingredients_arranged + ", " + ingredient;
      }
    })

    // Taking price
    this.price_arranged = this.details.item.price + " TL";

    this.theme = { GRID: "grid", LIST: "list" };

  }

  render() {
    if (this.props.theme == this.theme.LIST) {
      const style = {
        WebkitBoxShadow: "2px 2px 3px 0px rgba(115, 115, 115, 0.56)",
        MozBoxShadow: "2px 2px 3px 0px rgba(115, 115, 115, 0.56)",
        boxShadow: "2px 2px 3px 0px rgba(115, 115, 115, 0.56)",
        backgroundColor: "rgba(0, 0, 0, 0.01)",
        marginTop: 15,
        marginBottom: 15,
        paddingTop: 20,
        paddingLeft: 20,
        paddingBottom: 20
      }
      return (
        <div style={style}>
          <img src={this.img_src} />
          <div style={{ display: "inline-block", marginLeft: "15px" }}>
            <b>{this.details.item.name}</b>
            <div>{this.ingredients_arranged}</div>
            <div>{this.price_arranged}</div>
            <FavoriteButton item_id={this.details.id}
              handleFav={this.props.handleFav}
              handleUnfav={this.props.handleUnfav}
            />
          </div>
        </div>
      );
    } else {
      return (
        <div style={{
          WebkitBoxShadow: "2px 2px 3px 0px rgba(115, 115, 115, 0.56)",
          MozBoxShadow: "2px 2px 3px 0px rgba(115, 115, 115, 0.56)",
          boxShadow: "2px 2px 3px 0px rgba(115, 115, 115, 0.56)",
          backgroundColor: "rgba(0, 0, 0, 0.01)",
          marginTop: 15,
          marginBottom: 15,
          marginRight: 15,
          paddingTop: 20,
          paddingLeft: 20,
          paddingRight: 20,
          paddingBottom: 20
        }}>
          <img src={this.img_src} />
          <p><b>{this.details.item.name}</b></p>
        </div>
      );
    }
  }
}

class FavoriteButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image_src: "./images/heart.png",
      clicked: false,
      text: "Favorilere ekle"
    };

    this.item_id = this.props.item_id;

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    if (this.state.clicked) {
      this.setState({
        image_src: "./images/heart.png",
        clicked: false,
        text: "Favorilere ekle"
      });
      this.props.handleUnfav(this.item_id);
    } else {
      this.setState({
        image_src: "./images/heart_filled.png",
        clicked: true,
        text: <b>Favorilerde</b>
      });
      this.props.handleFav(this.item_id);
    }
  }

  render() {
    return (
      <div>
        <img src={this.state.image_src} onClick={this.handleClick} />
        {this.state.text}
      </div>
    )
  }
}

class MenuLayout extends React.Component {
  constructor(props) {
    super(props);

    this.sections = props.sections;
    console.log("ITEM-SECTIONS: " + JSON.stringify(this.sections))
    this.item_order = props.item_order;
    console.log("ITEM-ORDER: " + JSON.stringify(this.item_order))
    this.item_list = props.item_list;
    console.log("ITEM-LIST: " + JSON.stringify(this.item_list))

    console.log(this.sections);

    this.handleFav = this.handleFav.bind(this);
    this.handleUnfav = this.handleUnfav.bind(this);

    this.theme = { GRID: "grid", LIST: "list" };
    this.handleChangeTheme = this.handleChangeTheme.bind(this);


    this.state = {
      order_changed: false,
      theme: this.theme.LIST
    }

    // keeps favorite item ids
    this.favorite_items = []
  }

  handleFav(item_id) {
    this.favorite_items.unshift(item_id);

    // This is only to trigger render
    let order_change = !this.state.order;
    this.setState({ order_changed: order_change })
  }

  handleUnfav(unfav_item_id) {
    let favoriteItemsNew = [];
    this.favorite_items.forEach((item_id) => {
      if (item_id !== unfav_item_id) {
        favoriteItemsNew.unshift(item_id);
      }
    })

    this.favorite_items = favoriteItemsNew;
    // This is only to trigger render
    let order_change = !this.state.order;
    this.setState({ order_changed: order_change })
  }

  handleChangeTheme(e) {
    if (this.state.theme == this.theme.GRID) {
      this.setState({ theme: this.theme.LIST })
      console.log("Theme has been changed to list")
    } else if(this.state.theme == this.theme.LIST){
      this.setState({ theme: this.theme.GRID })
      console.log("Theme has been changed to grid")
    }
  }

  render() {
    //console.log("RENDERING AGAIN?? keyword: " + this.props.search_keyword)

    this.searchKeyword = this.props.search_keyword;

    // For each section
    const sectionViews = this.sections.map((section_name, index) => {
      console.log("Mapping: " + section_name)

      const item_order_for_section = this.item_order[index].items;
      console.log("Section item-order: " + item_order_for_section)

      const item_list_for_section = []

      // Searching for items with the id in item order
      item_order_for_section.forEach((item_id) => {
        console.log("Searching for item with id: " + item_id);
        this.item_list.forEach((item) => {
          // check whether the item is the item we are looking for
          if (item.id == item_id) {
            // if there is no search, just put in item list
            // else check the word if it starts with the keyword or not
            // console.log("SearchKeyword:" + this.searchKeyword)
            // if (this.searchKeyword == "") {
            //   item_list_for_section.push(item);
            //   console.log("Item with Id " + item_id + " found!");
            // } else if (item.item.name.startsWith(this.searchKeyword)) {
            //   item_list_for_section.push(item);
            //   console.log("Item with Id " + item_id + " found!");
            // }
            console.log("MenuLayout/Item with Id " + item_id + " found! " + item.item.name.toLowerCase());
            console.log("MenuLayout/SearchKeyword: " + this.searchKeyword);
            if (item.item.name.toLowerCase().startsWith(this.searchKeyword.toLowerCase())) {
              let favoriteItem = false;
              this.favorite_items.forEach((fav_item_id) => {
                if (fav_item_id == item.id) {
                  favoriteItem = true;
                  item_list_for_section.unshift(item);
                  console.log("Favorite Item " + item.item.name + " starts with " + this.searchKeyword);
                }
              });
              if (!favoriteItem) {
                item_list_for_section.push(item);
                console.log("Item " + item.item.name + " starts with " + this.searchKeyword)
              }
            }
          }
        })
      })
      console.log("Rendering new itemlist for " + section_name + ": " + item_list_for_section);
      // console.log(section_name + " ITEMS: " + JSON.stringify(item_list_for_section))
      return (<SectionView section_name={section_name}
        item_list={item_list_for_section}
        key={section_name}
        handleFav={this.handleFav}
        handleUnfav={this.handleUnfav}
        theme={this.state.theme}
      />)
    });

    return (
      <div>
        <div style={{ textAlign: "center" }}>
          <button style={{ marginTop: "20px", width: "200px", height: "50px" }} value={this.theme.LIST} onClick={this.handleChangeTheme}>List</button>
          <button style={{ marginTop: "20px", width: "200px", height: "50px" }} value={this.theme.GRID} onClick={this.handleChangeTheme}>Grid</button>
        </div>
        {sectionViews}
      </div>
    );
  }
}

class Restaurant extends React.Component {
  constructor(props) {
    super(props);

    this.state = { searchKeyword: "" };

    this.handleSearch = this.handleSearch.bind(this);
  }

  handleSearch(keyword) {
    console.log("HandleSearch methoduna girdik");
    this.setState({ searchKeyword: keyword });
  }

  render() {
    const restaurant = window.data.restaurant;
    const searchKeyword = this.state.searchKeyword;
    return <div style={{ marginLeft: "300px", marginRight: "300px" }}>
      <h1>Welcome to {restaurant.name}</h1>
      <div>
        <h2>
          Please find our menu below
        </h2>
        <h3>
          {restaurant.active_menu.menu_name}
        </h3>
        <div>
          <SearchBar handleChange={this.handleSearch} />
          <MenuLayout sections={restaurant.active_menu.menu.sections}
            item_order={restaurant.active_menu.menu.item_order}
            item_list={restaurant.active_menu.menu.items}
            search_keyword={searchKeyword}
          />
        </div>
      </div>
    </div>
  }
}

$(function () {
  ReactDOM.render(
    <Restaurant />,
    document.getElementById('react-root')
  );
})
