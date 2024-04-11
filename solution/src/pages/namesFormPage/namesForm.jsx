import { useState, useEffect, useRef } from 'react';
import { Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { isNameValid, getLocations } from '../../mock-api/apis';
import { addName, clearAll } from '../../reducers/nameReducer';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { debounceRequest } from '../../utilities/debounceRequest';

const NamesForm = () => {
    const {
        register,
        handleSubmit,
        reset,
        setError,
        clearErrors,
        formState: { errors }
    } = useForm();

    const dispatch = useDispatch();

    // This variable tracks the index of issued requests to prevent race conditions
    // during rapid input changes. Ensures only the response from the latest request is processed.
    const nameValidationRequestIndex = useRef(0);

    const [locationList, setLocationList] = useState([]);
    const [nameIsValidating, setNameIsValidating] = useState(false);

    const handleNameValidation = async (name) => {
        // Increament request count
        var reqIndex = nameValidationRequestIndex.current++;

        // Mark the start of name validation process to manage UI feedback or disable form elements during validation.
        setNameIsValidating(true);

        // Clear existing errors.
        clearErrors('name');

        try {
            // Await the asynchronous validation of the name to determine its validity.
            const isValid = await isNameValid(name);

            // The reqIndex check ensures only the response from the latest validation request is processed,
            // preventing race conditions where earlier responses could overwrite later ones.
            if (reqIndex < nameValidationRequestIndex.current - 1) return;

            // If the name is not valid (i.e., already taken), set a custom error message for the 'name' field.
            if (!isValid) {
                setError('name', {
                    type: 'custom',
                    message: 'The name has already been taken',
                });
            }
        } finally {
            // Stop the name validation indicator and decrement the request index counter
            // only if the current request is the last or a subsequent one in the queue.
            if (reqIndex >= nameValidationRequestIndex.current - 1) {
                setNameIsValidating(false);
            }

            // This ensures that the validation indicator reflects the actual state of ongoing validations,
            // preventing premature termination of the indicator while still processing other requests.
            nameValidationRequestIndex.current--;
        }
    }

    const handleSubmitRequest = async (data) => {
        // Destructure name and location from the submitted form data
        const { name, location } = data;

        // Dispatch an action to add the name and location to the Redux store or context
        dispatch(addName({ name, location }));

        // Clear any form errors upon successful submission
        clearErrors();
    };

    const handleClearRequest = () => {
        // Dispatch an action to clear all form-related data from the global state or context.
        dispatch(clearAll());

        // Reset the form fields to their initial values.
        reset();
    };

    const handleNameChange = (newName) => {
        // Create a debounced function that validates the name, delaying the execution to avoid frequent API calls.
        const debouncedCheck = debounceRequest(async (name) => await handleNameValidation(name), 1000);

        if (newName) {
            debouncedCheck(newName);
        }
    };

    const updateLocationList = (setLocationList) => {
        // Asynchronously fetches location data and updates the state.
        const getLocationData = async () => {
            try {
                // Attempt to fetch the list of locations.
                const locationListData = await getLocations();

                // Update the location list state with the fetched data.
                setLocationList(locationListData);
            } catch (error) {
                // Log any errors encountered during fetch.
                console.error(error.message);
            }
        };

        getLocationData();
    }

    useEffect(() => {
        // Set the initial list of locations.
        updateLocationList(setLocationList);
    }, []); 


    const FormHeading =
        <Form.Group
            as={Row}
            className="mb-3">
            <Col
                span="2">
                <Form.Label
                    className="fw-bold">
                    Names Form
                </Form.Label>
            </Col>
        </Form.Group>;


    const NameField =
        <Form.Group
            as={Row}
            className="mb-3"
            controlId="name">
            <Col
                sm="2">
                <Form.Label>Name</Form.Label>
            </Col>
            <Col
                sm="5">
                <Form.Control
                    type="text"
                    name="name"
                    isInvalid={errors.name && errors.name.message}
                    {...register('name', {
                        required: 'Name is required',
                        onChange: (event) => handleNameChange(event.target.value)
                    })} />
                {errors.name && (
                    <Alert
                        variant="danger">
                        {errors.name.message}
                    </Alert>
                )}

                {nameIsValidating && (
                    <Alert
                        variant="light">
                        Validating...
                    </Alert>
                )}

            </Col>
        </Form.Group>;

    const LocationField =
        <Form.Group
            as={Row}
            className="mb-3"
            controlId="location">
            <Col
                sm="2">
                <Form.Label>Location</Form.Label>
            </Col>
            <Col
                sm="5">
                <Form.Select
                    isInvalid={errors.location}
                    {...register('location', {
                        required: 'Location is required'
                    })}>
                    <option></option>
                    {locationList && locationList.map((locationName) => <option
                        value={locationName}
                        key={locationName}>
                        {locationName}
                    </option>
                    )}
                </Form.Select>
                {errors.location && (
                    <Alert
                        variant="danger">
                        {errors.location.message}
                    </Alert>
                )}
            </Col>
        </Form.Group>;

    const FormActions =
        <Form.Group
            as={Row}
            className="mb-3 text-end"
            controlId="action">
            <Col
                span="2"
                sm="7">
                <Button
                    variant="outline-secondary"
                    className="m-1"
                    onClick={handleClearRequest}>
                    Clear
                </Button>
                <Button
                    variant="outline-primary"
                    className="m-1"
                    type="submit"
                    disabled={errors.name || errors.location || nameIsValidating}>
                    Add
                </Button>
            </Col>
        </Form.Group>;

    return (
        <Form
            onSubmit={handleSubmit(handleSubmitRequest)}>

            {FormHeading}

            {NameField}
            {LocationField}

            {FormActions}
        </Form>

    )
}

export { NamesForm };
