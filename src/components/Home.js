import React, { Component } from "react";
import fire from "../config/fire";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import QRCode from "qrcode.react";

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      user_login: false,
      data: null,
      registration_step: 1,
      tabIndex: 0,
      foodType: "",
      foodTypeOption: "",
      foodName: "",
      foodPrice: "",
      veg: false,
      non_veg: false,
      pure_jain: false,
      selectedFood: -1,
      qr_code_url: "",
    };

    this.getData = this.getData.bind(this);
    this.logout = this.logout.bind(this);
    this.insertFoodType = this.insertFoodType.bind(this);
    this.deleteFoodType = this.deleteFoodType.bind(this);
    this.changeTab = this.changeTab.bind(this);
    this.updateFoodName = this.updateFoodName.bind(this);
    this.updateFoodPrice = this.updateFoodPrice.bind(this);
    this.updateNonVeg = this.updateNonVeg.bind(this);
    this.updatePureVeg = this.updatePureVeg.bind(this);
    this.downloadQR = this.downloadQR.bind(this);
  }
  async componentDidMount() {
    await this.authListener();
    this.setState({
      qr_code_url:
        "https://practical-ritchie-dd48fb.netlify.com/?restaurant_id=" +
        this.state.user.uid,
    });
    this.getData();
  }
  authListener() {
    fire.auth().onAuthStateChanged((user) => {
      if (user) {
        console.log(user);
        this.setState({ user: user, user_login: true });
      } else {
        this.setState({ user: false });
      }
    });
  }

  logout(e) {
    fire
      .auth()
      .signOut()
      .then(
        this.setState({
          user: null,
          user_login: false,
        })
      );
  }

  updateFoodType(e) {
    this.setState({
      foodType: e.target.value,
    });
  }
  updateFoodName(e) {
    this.setState({
      foodName: e.target.value,
    });
  }

  updateFoodPrice(e) {
    this.setState({
      foodPrice: e.target.value,
    });
  }
  getData() {
    const itemsRef = fire.database().ref("restaurant/" + this.state.user.uid);
    itemsRef.on("value", (snapshot) => {
      if (snapshot.val()) {
        let items = snapshot.val();
        this.setState({
          data: items,
        });
      } else {
        fire
          .database()
          .ref("restaurant/" + this.state.user.uid)
          .set({
            admin_email: this.state.user.email,
            restaurant_id: this.state.user.uid,
            restaurant_name: "Ashish Restaurant",
            restaurant_address:
              "102 - 103, Sai Residency, Amroli Katargam Road, Near Gajera School, Katargam, Surat",
            restaurant_phone: "9897969599",
            contact_person_name: "Aniket Patel",
            contact_person_phone: "7874353232",
            date_of_joining: Date.now(),
            menu: [
              {
                type: "Drink",
                items: [
                  {
                    itemName: "test",
                    price: 0,
                  },
                ],
              },
            ],
          });
      }
    });
  }

  deleteFoodType(index) {
    fire
      .database()
      .ref("restaurant/" + this.state.user.uid + "/menu/" + index)
      .remove();
  }

  insertFoodType() {
    fire
      .database()
      .ref(
        "restaurant/" +
          this.state.user.uid +
          "/menu/" +
          this.state.data.menu.length
      )
      .set({
        type: this.state.foodType,
        items: [
          {
            itemName: "test",
            price: 0,
            veg: false,
            non_veg: false,
            pure_jain: false,
          },
        ],
      })
      .then(() =>
        this.setState({
          foodType: "",
          itemName: "",
          price: 0,
          veg: false,
          non_veg: false,
          pure_jain: false,
        })
      );
  }

  insertFoodItem() {
    var url =
      "restaurant/" +
      this.state.user.uid +
      "/menu/" +
      this.state.foodTypeOption +
      "/items/" +
      this.state.data.menu[this.state.foodTypeOption].items.length;
    fire
      .database()
      .ref(url)
      .set({
        itemName: this.state.foodName,
        price: this.state.foodPrice,
        veg: this.state.veg,
        non_veg: this.state.non_veg,
        pure_jain: this.state.pure_jain,
      })
      .then(() => {
        this.setState({
          foodName: "",
          foodPrice: " ",
          veg: false,
          non_veg: false,
          pure_jain: false,
        });
      });
  }

  changeTab(tabIndex) {
    this.setState({ tabIndex: tabIndex });
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  updateNonVeg() {
    if (this.state.non_veg)
      this.setState({ non_veg: !this.state.non_veg, veg: true });
    else this.setState({ pure_jain: false, veg: false, non_veg: true });
  }
  updatePureVeg() {
    if (this.state.pure_jain)
      this.setState({ pure_jain: !this.state.pure_jain });
    else
      this.setState({
        pure_jain: !this.state.pure_jain,
        veg: true,
        non_veg: false,
      });
  }

  updateSelectedFood(number) {
    this.setState({ selectedFood: number });
  }

  downloadQR() {
    const canvas = document.getElementById("qr-code");
    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    let downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = this.state.user.uid + ".png";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }
  render() {
    var {
      user,
      qr_code_url,
      data,
      registration_step,
      tabIndex,
      foodTypeOption,
      foodName,
      foodPrice,
      non_veg,
      pure_jain,
      selectedFood,
      qr_code_url,
    } = this.state;
    return (
      <div style={{ backgroundColor: "#f7f7f7", height: "100vh" }}>
        <div className="row p-4 main-page">
          <div className="right-dashboard col-12">
            <div className="float-left">
              <h3 className="dashboard-title">My Dashboard</h3>
            </div>
            <div className="float-right">
              <button
                type="button"
                className="btn btn-outline-info m-1 float-right"
                onClick={this.logout}
              >
                {" "}
                Logout
              </button>
              <button
                type="button"
                className="btn bg-dark text-white m-1 float-right"
                disabled
              >
                {" "}
                {user ? user.uid : null}{" "}
              </button>
            </div>
            <br />
            <br />
            <hr />
            <button
              type="button"
              className="btn btn-outline-primary m-1"
              onClick={() => this.changeTab(0)}
            >
              {" "}
              Food{" "}
            </button>
            <button
              type="button"
              className="btn btn-outline-success m-1"
              onClick={() => this.changeTab(2)}
            >
              Menu
            </button>
            <button
              type="button"
              className="btn btn-outline-warning m-1"
              onClick={() => this.changeTab(3)}
            >
              {" "}
              Code
            </button>
            <hr />
            <br />
            <br />
            {tabIndex === 0 && data ? (
              <div className="row food-type">
                <div className="col-3 vertical-line">
                  <div className="form-group ">
                    <label htmlFor="foodType font-weight-bold">Food Type</label>
                    <input
                      type="text"
                      className="form-control w-75"
                      id="foodType"
                      placeholder="Enter food type"
                      value={this.state.foodType}
                      onChange={(evt) => this.updateFoodType(evt)}
                    />
                  </div>
                  <button
                    type="button"
                    className="btn btn-outline-success m-1"
                    onClick={() => this.insertFoodType()}
                  >
                    Add
                  </button>
                </div>
                <div className="col-5">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th scope="col">Food Types</th>
                        <th scope="col">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.menu.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td className="text-capitalize">{item.type}</td>
                            <td>
                              <span
                                className="badge badge-pill badge-danger m-1"
                                onClick={() => {
                                  if (
                                    window.confirm(
                                      "Are you sure you wish to delete this item?"
                                    )
                                  )
                                    this.deleteFoodType(index);
                                }}
                              >
                                X
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="col-4">
                  <div className="add-item bg-light rounded py-3">
                    <form>
                      <div className="col-auto my-1">
                        <label
                          className="mr-sm-2"
                          htmlFor="inlineFormCustomSelect"
                        >
                          Select Food Type
                        </label>
                        <select
                          name="foodTypeOption"
                          className="custom-select mr-sm-2"
                          id="inlineFormCustomSelect"
                          onChange={this.handleChange}
                        >
                          <option selected>Choose...</option>
                          {data.menu.map((item, index) => {
                            return (
                              <option className="text-capitalize" value={index}>
                                {item.type}
                              </option>
                            );
                          })}
                        </select>
                      </div>

                      <div className="col-auto my-1">
                        <label className="mr-sm-2" htmlFor="itemName">
                          Food Name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="foodItemName"
                          placeholder="Enter Food Name"
                          value={this.state.foodName}
                          onChange={(evt) => this.updateFoodName(evt)}
                        />
                      </div>

                      <div className="col-auto my-1">
                        <label className="mr-sm-2" htmlFor="itemPrice">
                          Food Price
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="foodPrice"
                          placeholder="Enter Food Price"
                          value={this.state.foodPrice}
                          onChange={(evt) => this.updateFoodPrice(evt)}
                        />
                      </div>
                      <br />
                      <div className="col-auto mx-1">
                        <label className="mr-sm-2" htmlFor="non_veg">
                          Non - Veg
                        </label>
                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={non_veg}
                            onChange={this.updateNonVeg}
                          />
                          <span className="slider rounded"></span>
                        </label>
                      </div>

                      <div className="col-auto mx-1">
                        <label
                          className="mr-sm-2"
                          htmlFor="inlineFormCustomSelect"
                        >
                          Pure Jain
                        </label>
                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={pure_jain}
                            onChange={this.updatePureVeg}
                          />
                          <span className="slider rounded"></span>
                        </label>
                      </div>
                      <div className="p-3">
                        <button
                          type="button"
                          className="btn btn-outline-success my-3 w-100"
                          onClick={() => this.insertFoodItem()}
                        >
                          Add Item
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            ) : tabIndex === 2 && data ? (
              <div className="my-menu">
                <div className="row">
                  <div className="col-3">
                    <h3>Food Types</h3>
                    <table className="table table-bordered">
                      <tbody className="menu-type-list">
                        {data.menu.map((item, index) => {
                          return (
                            <tr key={index}>
                              <td className="text-capitalize">{item.type}</td>
                              <td>
                                <span
                                  className="badge badge-pill badge-info m-1"
                                  onClick={() => this.updateSelectedFood(index)}
                                >
                                  View
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  {selectedFood > -1 ? (
                    <div className="col-9 menu-items">
                      <h3>Food Items</h3>

                      <table className="table table-bordered">
                        {data.menu[selectedFood].items.length > 0 ? (
                          <thead>
                            <tr>
                              <td className="text-capitalize">Sr. No.</td>
                              <td className="text-capitalize">Name</td>
                              <td className="text-capitalize">Price (Rs.)</td>
                              <td className="text-capitalize">Veg</td>
                              <td className="text-capitalize">Pure Jain</td>
                              <td className="text-capitalize">Non-Veg</td>
                              <td className="text-capitalize">Action</td>
                            </tr>
                          </thead>
                        ) : (
                          <div></div>
                        )}
                        <tbody>
                          {data.menu[selectedFood].items.map((item, index) => {
                            return (
                              <tr key={index}>
                                <td className="text-center">{index + 1}</td>
                                <td className="text-capitalize">
                                  {item.itemName}
                                </td>
                                <td className="text-center">{item.price}</td>
                                <td className="text-center">
                                  {item.veg ? "Veg" : "---"}
                                </td>
                                <td className="text-center">
                                  {item.pure_jain ? "Jain" : "---"}
                                </td>
                                <td className="text-center">
                                  {item.non_veg ? "Non Veg" : "---"}
                                </td>

                                <td>
                                  <span
                                    className="badge badge-pill badge-info m-1"
                                    onClick={() => {
                                      if (
                                        window.confirm(
                                          "Are you sure you wish to delete this item?"
                                        )
                                      )
                                        this.deleteFoodType(index);
                                    }}
                                  >
                                    {" "}
                                    U{" "}
                                  </span>
                                  <span
                                    className="badge badge-pill badge-danger m-1"
                                    onClick={() => {
                                      if (
                                        window.confirm(
                                          "Are you sure you wish to delete this item?"
                                        )
                                      )
                                        this.deleteFoodType(index);
                                    }}
                                  >
                                    {" "}
                                    X{" "}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="col-8"></div>
                  )}
                </div>
              </div>
            ) : (
              <div className="qr-code">
                <QRCode
                  className="qr-code-box"
                  id="qr-code"
                  value={qr_code_url}
                  size={290}
                  level={"H"}
                  includeMargin={true}
                />
                <br />
                <button
                  type="button"
                  className="btn btn-outline-success my-3"
                  onClick={() => this.downloadQR()}
                >
                  Download QR
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
