import React, {
	useState,
	useEffect,
	useReducer,
	useContext,
	useRef,
} from "react";

import Card from "../UI/Card/Card";
import classes from "./Login.module.css";
import Button from "../UI/Button/Button";
import FormInput from "../UI/FormInput/FormInput";
import AuthContext from "../../store/auth-context";

const initialEmailState = { value: "", isValid: true };
const emailReducer = (state, action) => {
	if (action.type === "USER_INPUT") {
		return { value: action.value, isValid: action.value.includes("@") };
	} else if (action.type === "INPUT_BLUR") {
		// DRY, the validation could be done in another function since it's being
		// reused
		return { value: state.value, isValid: state.value.includes("@") };
	}
	return { value: "", isValid: false };
};

const initialPasswordState = { value: "", isValid: true };
const passwordReducer = (state, action) => {
	if (action.type === "USER_INPUT") {
		return { value: action.value, isValid: action.value.trim().length > 6 };
	} else if (action.type === "INPUT_BLUR") {
		return { value: state.value, isValid: state.value.trim().length > 6 };
	}
	return { value: "", isValid: false };
};

const Login = (props) => {
	// const [enteredEmail, setEnteredEmail] = useState("");
	// const [emailIsValid, setEmailIsValid] = useState();
	// const [enteredPassword, setEnteredPassword] = useState("");
	// const [passwordIsValid, setPasswordIsValid] = useState();
	const [formIsValid, setFormIsValid] = useState(false);

	const [emailState, dispatchEmail] = useReducer(
		emailReducer,
		initialEmailState
	);

	const [passwordState, dispatchPassword] = useReducer(
		passwordReducer,
		initialPasswordState
	);

	const authCtx = useContext(AuthContext);

	const emailChangeHandler = (event) => {
		dispatchEmail({ type: "USER_INPUT", value: event.target.value });
	};

	const passwordChangeHandler = (event) => {
		dispatchPassword({ type: "USER_INPUT", value: event.target.value });
	};

	const validateEmailHandler = () => {
		dispatchEmail({ type: "INPUT_BLUR" });
	};

	const validatePasswordHandler = () => {
		dispatchPassword({ type: "INPUT_BLUR" });
	};

	const { isValid: emailStateValidity } = emailState;
	const { isValid: passwordStateValidity } = passwordState;

	useEffect(() => {
		console.log("Checking form validity!");
		const identifier = setTimeout(() => {
			setFormIsValid(passwordStateValidity && emailStateValidity);
		}, 500);

		// Cleanup function
		return () => {
			console.log("Cleanup!");
			clearTimeout(identifier);
		};
	}, [emailStateValidity, passwordStateValidity]);

	const emailInputRef = useRef();
	const passwordInputRef = useRef();
	const submitHandler = (event) => {
		event.preventDefault();
		if (formIsValid) {
			authCtx.onLogin(emailState.value, passwordState.value);
		} else if (!emailStateValidity) {
			emailInputRef.current.activate();
		} else {
			passwordInputRef.current.activate();
		}
	};

	return (
		<Card className={classes.login}>
			<form onSubmit={submitHandler}>
				<FormInput
					ref={emailInputRef}
					type="email"
					id="email"
					label="E-Mail"
					isValid={emailStateValidity}
					value={emailState.value}
					onChange={emailChangeHandler}
					onBlur={validateEmailHandler}
				/>
				<FormInput
					ref={passwordInputRef}
					type="password"
					id="password"
					label="Password"
					isValid={passwordStateValidity}
					value={passwordState.value}
					onChange={passwordChangeHandler}
					onBlur={validatePasswordHandler}
				/>

				<div className={classes.actions}>
					<Button type="submit" className={classes.btn}>
						Login
					</Button>
				</div>
			</form>
		</Card>
	);
};

export default Login;
