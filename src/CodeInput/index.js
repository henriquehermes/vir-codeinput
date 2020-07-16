import React, { Component } from "react";
import PropTypes from "prop-types";

import "./styles.css";

const KEY_CODE = {
	backspace: 8,
	left: 37,
	up: 38,
	right: 39,
	down: 40,
};

export default class ReactCodeInput extends Component {
	static propTypes = {
		onChange: PropTypes.func,
		onComplete: PropTypes.func,
		fields: PropTypes.number,
		autoFocus: PropTypes.bool,
		values: PropTypes.arrayOf(PropTypes.string),
	};

	static defaultProps = {
		fields: 4,
		autoFocus: true,
	};

	constructor(props) {
		super(props);
		const { fields, values } = props;
		let vals;
		let autoFocusIndex = 0;
		if (values && values.length) {
			vals = [];
			for (let i = 0; i < fields; i++) {
				vals.push(values[i] || "");
			}
			autoFocusIndex = values.length >= fields ? 0 : values.length;
		} else {
			vals = Array(fields).fill("");
		}
		this.state = { values: vals, autoFocusIndex };

		this.iRefs = [];
		for (let i = 0; i < fields; i++) {
			this.iRefs.push(React.createRef());
		}
		this.id = +new Date();

		// this.handleKeys = Array(fields).fill(false);
	}

	/**
	 * Clear all field value & focus first field
	 */
	__clearvalues__ = () => {
		const { fields } = this.props;
		this.setState({ values: Array(fields).fill("") });
		this.iRefs[0].current.focus();
	};

	triggerChange = (values = this.state.values) => {
		const { onChange, onComplete, fields } = this.props;
		const val = values.join("");
		onChange && onChange(val);
		if (onComplete && val.length >= fields) {
			onComplete(val);
		}
	};

	onChange = (e) => {
		const index = parseInt(e.target.dataset.id);
		if (this.props.type === "number") {
			e.target.value = e.target.value.replace(/[^\d]/gi, "");
		}
		// this.handleKeys[index] = false;
		if (
			e.target.value === "" ||
			(this.props.type === "number" && !e.target.validity.valid)
		) {
			return;
		}
		const { fields } = this.props;
		let next;
		const value = e.target.value;
		let { values } = this.state;
		values = Object.assign([], values);
		if (value.length > 1) {
			let nextIndex = value.length + index - 1;
			if (nextIndex >= fields) {
				nextIndex = fields - 1;
			}
			next = this.iRefs[nextIndex];
			const split = value.split("");
			split.forEach((item, i) => {
				const cursor = index + i;
				if (cursor < fields) {
					values[cursor] = item;
				}
			});
			this.setState({ values });
		} else {
			next = this.iRefs[index + 1];
			values[index] = value;
			this.setState({ values });
		}

		if (next) {
			next.current.focus();
			next.current.select();
		}

		this.triggerChange(values);
	};

	onKeyDown = (e) => {
		const index = parseInt(e.target.dataset.id);
		const prevIndex = index - 1;
		const nextIndex = index + 1;
		const prev = this.iRefs[prevIndex];
		const next = this.iRefs[nextIndex];
		switch (e.keyCode) {
			case KEY_CODE.backspace:
				e.preventDefault();
				const vals = [...this.state.values];
				if (this.state.values[index]) {
					vals[index] = "";
					this.setState({ values: vals });
					this.triggerChange(vals);
				} else if (prev) {
					vals[prevIndex] = "";
					prev.current.focus();
					this.setState({ values: vals });
					this.triggerChange(vals);
				}
				break;
			case KEY_CODE.left:
				e.preventDefault();
				if (prev) {
					prev.current.focus();
				}
				break;
			case KEY_CODE.right:
				e.preventDefault();
				if (next) {
					next.current.focus();
				}
				break;
			case KEY_CODE.up:
			case KEY_CODE.down:
				e.preventDefault();
				break;
			default:
				// this.handleKeys[index] = true;
				break;
		}
	};

	onFocus = (e) => {
		e.target.select(e);
	};

	render() {
		const { values, autoFocusIndex } = this.state;
		const { autoFocus } = this.props;

		return (
			<div className={"react-code-input-container"}>
				<div className={"react-code-input"}>
					{values.map((value, index) => (
						<input
							type="tel"
							pattern="[0-9]*"
							autoFocus={autoFocus && index === autoFocusIndex}
							key={`${this.id}-${index}`}
							data-id={index}
							value={value}
							ref={this.iRefs[index]}
							onChange={this.onChange}
							onKeyDown={this.onKeyDown}
							onFocus={this.onFocus}
						/>
					))}
				</div>
			</div>
		);
	}
}
