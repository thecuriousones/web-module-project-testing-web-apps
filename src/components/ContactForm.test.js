import React from 'react';
import {render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ContactForm from './ContactForm';
import DisplayComponent from './DisplayComponent';

test('renders without errors', ()=>{
    render(<ContactForm />);
});

test('renders the contact form header', ()=> {
    // Arrange
    render(<ContactForm />);

    // Act
    const header = screen.getByText(/contact form/i);

    // Assert
    expect(header).toBeInTheDocument();
    expect(header).toBeTruthy();
    expect(header).toHaveTextContent(/contact form/i);
});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
    // Arrange
    render(<ContactForm />);
    const firstName = screen.getByLabelText(/first name/i);

    // Act 
    userEvent.type(firstName, 'Sam');

    // Assert 
    await waitFor(()=> {
        const errorMessages = screen.queryAllByTestId("error");
        expect(errorMessages).toHaveLength(1);
    })

});

test('renders THREE error messages if user enters no values into any fields.', async () => {
    // Arrange
    render(<ContactForm />);
    const submitButton = screen.getByRole('button');

    // Act 
    userEvent.click(submitButton);
    
    // Assert 
    await waitFor(()=> {
        const errorMessages = screen.queryAllByTestId("error");
        expect(errorMessages).toHaveLength(3);
    })
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
    // Arrange 
    render(<ContactForm />);
    const firstName = screen.getByLabelText(/first name/i);
    const lastName = screen.getByLabelText(/last name/i);
    const submitButton = screen.getByRole('button');

    // Act
    userEvent.type(firstName, 'Tamara');
    userEvent.type(lastName, 'Leonard');
    userEvent.click(submitButton);
    

    // Assert 
    await waitFor(()=> {
        const errorMessages = screen.queryAllByTestId("error");
        expect(errorMessages).toHaveLength(1);
    })
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
    // Arrange 
    render(<ContactForm />);
    const email = screen.getByLabelText(/email/i)

    // Act 
    userEvent.type(email, '123')

    // Assert 
    await waitFor(()=> {
        const errorMessage = screen.findByText(/email must be a valid email address/i);
        expect(errorMessage).toBeInTheDocument;
    })
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
    // Arrange 
    render(<ContactForm />);
    const firstName = screen.getByLabelText(/first name/i);
    const submitButton = screen.getByRole('button');

    // Act
     userEvent.type(firstName, 'Tamara');
     userEvent.click(submitButton);

    // Assert 
    await waitFor(()=> {
        const errorMessage = screen.findByText(/lastName is a required field/i);
        expect(errorMessage).toBeInTheDocument;
    })

});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
    // Arrange 
    render(<ContactForm />);
    const firstName = screen.getByLabelText(/first name/i);
    const lastName = screen.getByLabelText(/last name/i);
    const email = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button');

    // Act 
    userEvent.type(firstName, 'Tamara');
    userEvent.type(lastName, 'Leonard');
    userEvent.type(email, 'tamaraleonard46@gmail.com');
    userEvent.click(submitButton);

    // Assert
    await waitFor(()=>{
        const firstnameDisplay = screen.queryByText("Tamara");
        const lastnameDisplay = screen.queryByText("Leonard");
        const emailDisplay = screen.queryByText("tamaraleonard46@gmail.com");
        const messageDisplay = screen.queryByTestId("messageDisplay");

        expect(firstnameDisplay).toBeInTheDocument();
        expect(lastnameDisplay).toBeInTheDocument();
        expect(emailDisplay).toBeInTheDocument();
        expect(messageDisplay).not.toBeInTheDocument();
    });
});

test('renders all fields text when all fields are submitted.', async () => {
    // Arrange
    render(<ContactForm />);
    const firstName = screen.getByLabelText(/first name/i);
    const lastName = screen.getByLabelText(/last name/i);
    const email = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button');
    const message = screen.getByLabelText(/message/i);

    // Act 
    userEvent.type(firstName, 'Tamara');
    userEvent.type(lastName, 'Leonard');
    userEvent.type(email, 'tamaraleonard46@gmail.com');
    userEvent.click(submitButton);
    userEvent.type(message, 'Need help retrieving account information');

    // Assert
    await waitFor(()=>{
        expect(screen.getByTestId("firstnameDisplay")).toBeInTheDocument;
        expect(screen.getByTestId("lastnameDisplay")).toBeInTheDocument;
        expect(screen.getByTestId("emailDisplay")).toBeInTheDocument;
        expect(screen.getByTestId("messageDisplay")).toBeInTheDocument;
    });
});