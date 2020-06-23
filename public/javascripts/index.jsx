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
        <input onChange={this.handleChange} />
      </div>
    );
  }
}

class SectionView extends React.Component {
  constructor(props) {
    super(props);

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
    } else {
      const menu_items_view = this.item_list.map((item) =>
        <MenuItem menu_item_details={item}
          key={item.id}
          handleFav={this.props.handleFav}
          handleUnfav={this.props.handleUnfav}
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

    // Favorite button

  }

  render() {
    return (
      <div style={{
        borderRadius: 25,
        backgroundColor: "rgba(255, 0, 0, 0.06)",
        marginTop: 15,
        marginBottom: 15,
        paddingTop: 20,
        paddingLeft: 15,
        paddingBottom: 10
      }}>
        <img src={this.img_src} />
        <div>{this.details.item.name}</div>
        <div>{this.ingredients_arranged}</div>
        <div>{this.price_arranged}</div>
        <FavoriteButton item_id={this.details.id}
          handleFav={this.props.handleFav}
          handleUnfav={this.props.handleUnfav}
        />
      </div>
    );
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

    this.state = { order_changed: false }

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
      />)
    });

    return (
      <div>
        <div>
          <button>List</button>
          <button>Grid</button>
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
    return <div>
      <h1>Welcome to {restaurant.name}</h1>
      <h2>searchKeyword: {searchKeyword}</h2>
      <div>
        <h2>
          Please find our menu below
        </h2>
        <h3>
          {restaurant.active_menu.menu_name}
          <SearchBar handleChange={this.handleSearch} />
          <MenuLayout sections={restaurant.active_menu.menu.sections}
            item_order={restaurant.active_menu.menu.item_order}
            item_list={restaurant.active_menu.menu.items}
            search_keyword={searchKeyword}
          />
        </h3>
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
