import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from "@testing-library/react"
import userEvent from '@testing-library/user-event'
import AddColumn from "../AddColumn"
import { BoardValuesProvider } from '../../../../contexts/BoardValuesContext';

describe('AddColumn', () => {
    test('click on add column button', async () => {
        render (
            <BoardValuesProvider>
                <AddColumn userToken='123' boardId='1' groupId='1'/>
            </BoardValuesProvider>
        )
        const addColumnButton = screen.getByTestId('add-column-button')
        userEvent.click(addColumnButton)
        const statusElement = await screen.findByText('Status')
        expect(statusElement).toBeInTheDocument()
    })
})