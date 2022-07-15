import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import * as yup from "yup";
import {
    currentUser,
    setGithubCredentials,
    changePassword
} from "./requests";
import LoggedInTopBar from "./LoggedInTopBar";
const userFormSchema = yup.object({
    username: yup.string().required("Username is required"),
    password: yup.string().required("Password is required")
});
const githubFormSchema = yup.object({
    gitHubUsername: yup.string().required("Username is required"),
    gitHubPassword: yup.string().required("Password is required")
});
function SettingsPage() {
    const [initialized] = useState(false);
    const [user, setUser] = useState({});
    const [githubUser, setGithubUser] = useState({});
    const handleUserSubmit = async evt => {
        const isValid = await userFormSchema.validate(evt);
        if (!isValid) {
            return;
        }
        try {
            await changePassword(evt);
            alert("Password changed");
        } catch (error) {
            alert("Password change failed");
        }
    };
    const handlegithubSubmit = async evt => {
        const isValid = await githubFormSchema.validate(evt);
        if (!isValid) {
            return;
        }
        try {
            await setGithubCredentials(evt);
            alert("github credentials changed");
        } catch (error) {
            alert("github credentials change failed");
        }
    };
    const getCurrentUser = async () => {
        const response = await currentUser();
        const { username, gitHubUsername } = response.data;
        setUser({ username });
        setGithubUser({ gitHubUsername });
    };
    useEffect(() => {
        if (!initialized) {
            getCurrentUser();
            // setInitialized(true);
        }
    });
    return (
        <>
            <LoggedInTopBar />
            <div className="page">
                <h1 className="text-center">Settings</h1>
                <h2>User Settings</h2>
                <Formik
                    validationSchema={userFormSchema}
                    onSubmit={handleUserSubmit}
                    initialValues={user}
                    enableReinitialize={true}
                >
                    {({
                        handleSubmit,
                        handleChange,
                        handleBlur,
                        values,
                        touched,
                        isInvalid,
                        errors
                    }) => (
                        <Form noValidate onSubmit={handleSubmit}>
                            <Form.Row>
                                <Form.Group as={Col} md="12" controlId="username">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="username"
                                        placeholder="Username"
                                        value={values.username || ""}
                                        onChange={handleChange}
                                        isInvalid={touched.username && errors.username}
                                        disabled
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.username}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group as={Col} md="12" controlId="password">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="password"
                                        placeholder="Password"
                                        value={values.password || ""}
                                        onChange={handleChange}
                                        isInvalid={touched.password && errors.password}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.password}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Form.Row>
                            <Button type="submit" style={{ marginRight: "10px" }}>
                                Save
                            </Button>
                        </Form>
                    )}
                </Formik>
                <br />
                <h2>GitHub Settings</h2>
                <Formik
                    validationSchema={githubFormSchema}
                    onSubmit={handlegithubSubmit}
                    initialValues={githubUser}
                    enableReinitialize={true}
                >
                    {({
                        handleSubmit,
                        handleChange,
                        handleBlur,
                        values,
                        touched,
                        isInvalid,
                        errors
                    }) => (
                        <Form noValidate onSubmit={handleSubmit}>
                            <Form.Row>
                                <Form.Group as={Col} md="12" controlId="gitHubUsername">
                                    <Form.Label>GitHub Username</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="gitHubUsername"
                                        placeholder="GitHub Username"
                                        value={values.gitHubUsername || ""}
                                        onChange={handleChange}
                                        isInvalid={
                                            touched.gitHubUsername && errors.gitHubUsername
                                        }
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.gitHubUsername}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group as={Col} md="12" controlId="gitHubPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="gitHubPassword"
                                        placeholder="GitHub Password"
                                        value={values.gitHubPassword || ""}
                                        onChange={handleChange}
                                        isInvalid={
                                            touched.gitHubPassword && errors.gitHubPassword
                                        }
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.gitHubPassword}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Form.Row>
                            <Button type="submit" style={{ marginRight: "10px" }}>
                                Save
                            </Button>
                        </Form>
                    )}
                </Formik>
            </div>
        </>
    );
}
export default SettingsPage;