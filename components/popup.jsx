"use client";
import styles from "../styles/popop.module.css";
import { Component } from "react";



class Popup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            message: "",
            fadeout: false
        };

        this.clearMessage = this.clearMessage.bind(this);
        this.showMessage = this.showMessage.bind(this);
    };


    clearMessage() {
        this.setState(function(state) {
            return {...state, message: ""};
        });
    };


    showMessage(message, fadeout=false) {
        if (this.state.fadeout && this.state.message != "") {
            return;
        }

        this.setState(function(state) {
            return {...state, message: message, fadeout: fadeout};
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

        if (this.state.fadeout) {
            setTimeout(this.clearMessage, 1500);
        }

        const centeredCls = this.props.centered ? styles["centered"] : "";
        const fadeoutCls = this.state.fadeout ? styles["fadeout"] : "";

        return (
            <div 
                className={`${styles["popup"]} ${centeredCls} ${fadeoutCls}`} 
                style={style}
            >
                <p className={styles["popup-msg"]}>{this.state.message}</p>
                {!this.state.fadeout &&
                <button className={styles["popup-btn"]} onClick={this.clearMessage}>
                    <img src="/close.svg" alt="close" />
                </button>
                }
            </div>
        );
    };
};



export default Popup;