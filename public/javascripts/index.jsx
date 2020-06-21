// import {SearchBar} from "components/searchBar.jsx";


class SearchBar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        Arama Yap
        <input>

        </input>
      </div>
    );
  }
}

class SectionView extends React.Component {
  constructor(props) {
    super(props);

    this.section_name = props.section_name;
    console.log("SectionView: section_name" + this.section_name);
    this.item_list = props.item_list;
    console.log("Item list: " + JSON.stringify(this.item_list))

    this.menu_items_view = this.item_list.map((item) =>
      <MenuItem menu_item_details={item} />
    )
  }

  render() {
    return (
      <div>
        <h3>{this.section_name}</h3>
        <hr></hr>
        {this.menu_items_view}
      </div>
    );
  }
}

class MenuItem extends React.Component {
  constructor(props) {
    super(props);

    this.details = props.menu_item_details;
    console.log(JSON.stringify(this.details.item))

    // Get the image of the item
    if (this.details.item.images.length !== 0) {
      this.img_src = this.details.item.images[0]["400"]
    } else {
      this.img_src = "https://omegamma.com.au/wp-content/uploads/2017/04/default-image.jpg";
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
  }

  render() {
    return (
      <div>
        <img src={this.img_src} />
        <div>{this.details.item.name}</div>
        <div>{this.ingredients_arranged}</div>
        <div>{this.price_arranged}</div>
      </div>
    );
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

    this.sectionViews = this.sections.map((section_name, index) => {
      console.log("Mapping: " + section_name)

      const item_order_for_section = this.item_order[index].items;
      console.log("Section item-order: " + item_order_for_section)

      const item_list_for_section = []

      item_order_for_section.forEach((item_id) => {
        console.log("Searching for item with id: " + item_id);
        this.item_list.forEach((item) => {
          // check whether the item is the item we are looking for
          if (item.id == item_id) {
            item_list_for_section.push(item);
            console.log("Item with Id " + item_id + " found!");
          }
        })
      })

      // console.log(section_name + " ITEMS: " + JSON.stringify(item_list_for_section))

      return (<SectionView section_name={section_name}
        item_list={item_list_for_section}
        key={section_name}
      />)
    });
  }

  render() {
    return (
      <div>
        <div>
          <button>List</button>
          <button>Grid</button>
        </div>
        {this.sectionViews}
      </div>
    );
  }
}



class Restaurant extends React.Component {
  render() {
    const restaurant = window.data.restaurant;
    return <div>
      <h1>Welcome to {restaurant.name}</h1>
      <div>
        <h2>
          Please find our menu below
        </h2>
        <h3>
          {restaurant.active_menu.menu_name}
          <SearchBar />
          <MenuLayout sections={restaurant.active_menu.menu.sections}
            item_order={restaurant.active_menu.menu.item_order}
            item_list={restaurant.active_menu.menu.items}
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
