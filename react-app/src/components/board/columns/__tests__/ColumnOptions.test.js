import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from '@testing-library/user-event'
import { BoardValuesContext } from '../../../../contexts/BoardValuesContext';
import { mockBoardValues } from '../../../../test-utils/mockValues';
import ColumnOptions from '../ColumnOptions';

describe('ColumnOptions', () => {
    test('show column options', async () => {
        render (
            <BoardValuesContext.Provider value={mockBoardValues}>
                <ColumnOptions i={0} j={0} userToken={123} boardId={1} 
                               columnOptionsSelectedId={[51, 0]} setColumnOptionsSelectedId={jest.fn()}/>
            </BoardValuesContext.Provider>
        )
        const columnOptionsButton = screen.getByTestId('open-column-options')
        userEvent.click(columnOptionsButton)
        const deleteButton = await screen.findByText('Delete')
        expect(deleteButton).toBeInTheDocument()

    })
})