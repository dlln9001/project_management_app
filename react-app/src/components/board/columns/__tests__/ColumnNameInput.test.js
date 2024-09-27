import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from '@testing-library/user-event'
import { BoardValuesContext } from '../../../../contexts/BoardValuesContext';
import ColumnNameInput from '../ColumnNameInput';
import { mockBoardValues } from '../../../../test-utils/mockValues';

describe('ColumnNameInput', () => {
    test('Input changes when typing', async () => {
        render (
            <BoardValuesContext.Provider value={mockBoardValues}>
                <ColumnNameInput i={0} j={0} userToken={123} columnNameFocused={false} setColumnNameFocused={jest.fn()}/>
            </BoardValuesContext.Provider>
        )
        const columnNameInput = screen.getByTestId('column-name-input')
        userEvent.click(columnNameInput)

        await userEvent.type(columnNameInput, ' + Typing in column name!')
        expect(columnNameInput).toHaveValue('Status + Typing in column name!')
    })
})