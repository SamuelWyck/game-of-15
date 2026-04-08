"use client";
import styles from "../styles/popop.module.css";
import { Component } from "react";



class Popup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            message: ""
        };

        this.clearMessage = this.clearMessage.bind(this);
        this.showMessage = this.showMessage.bind(this);
    };


    clearMessage() {
        this.setState(function(state) {
            return {...state, message: ""};
        });
    };


    showMessage(message) {
        this.setState(function(state) {
            return {...state, message: message};
        });
    };


    render() {
        if (this.state.message === "") {
            return null;
        }

        const style = {top: `${this.props.top}px`};
        if (!this.props.centered) {
            style.left = `${this.props.left}px`;
        }

        return (
            <div 
                className={`${styles["popup"]} ${this.props.centered ? styles["centered"] : ""}`} 
                style={style}
            >
                <p className={styles["popup-msg"]}>{this.state.message}</p>
                <button className={styles["popup-btn"]} onClick={this.clearMessage}>
                    <img src="/close.svg" alt="close" />
                </button>
            </div>
        );
    };
};



export default Popup;