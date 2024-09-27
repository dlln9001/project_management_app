

// Complete mockBoardValues with all properties from BoardValuesContext
export const mockBoardValues = {
    boardTitle: 'Test Board',
    setBoardTitle: jest.fn(),
    boardInfo: 'Test Info',
    setBoardInfo: jest.fn(),
    renderComponent: false,
    setRenderComponent: jest.fn(),
    renderGroups: false,
    setRenderGroups: jest.fn(),
    groupsData: {
        "status": "success",
        "groupsInfo": [
            {
                "name": "Group 1",
                "id": 58,
                "order": 0,
                "color": "bg-emerald-600"
            },
            {
                "name": "New Group",
                "id": 59,
                "order": 1,
                "color": "bg-orange-600"
            },
            {
                "name": "New Group",
                "id": 64,
                "order": 2,
                "color": "bg-sky-400"
            }
        ],
        "itemsInfo": [
            [
                {
                    "name": "asd",
                    "id": 108,
                    "order": 0,
                    "group": 58
                },
                {
                    "name": "a dss",
                    "id": 109,
                    "order": 1,
                    "group": 58
                },
                {
                    "name": "d",
                    "id": 133,
                    "order": 3,
                    "group": 58
                },
                {
                    "name": "d asdf asdf",
                    "id": 132,
                    "order": 4,
                    "group": 58
                }
            ],
            [
                {
                    "name": "asdf",
                    "id": 111,
                    "order": 0,
                    "group": 59
                },
                {
                    "name": "asdf",
                    "id": 112,
                    "order": 1,
                    "group": 59
                },
                {
                    "name": "sfd",
                    "id": 113,
                    "order": 2,
                    "group": 59
                }
            ],
            []
        ],
        "columnValues": [
            [
                [
                    {
                        "value_text": "Done",
                        "value_color": "bg-green-500",
                        "value_date": null,
                        "value_person": null,
                        "item": 108,
                        "column": 51,
                        "id": 161
                    },
                    {
                        "value_text": "",
                        "value_color": "bg-neutral-400",
                        "value_date": null,
                        "value_person": null,
                        "item": 108,
                        "column": 54,
                        "id": 201
                    }
                ],
                [
                    {
                        "value_text": "Done",
                        "value_color": "bg-green-500",
                        "value_date": null,
                        "value_person": null,
                        "item": 109,
                        "column": 51,
                        "id": 162
                    },
                    {
                        "value_text": "Working on it",
                        "value_color": "bg-orange-300",
                        "value_date": null,
                        "value_person": null,
                        "item": 109,
                        "column": 54,
                        "id": 198
                    }
                ],
                [
                    {
                        "value_text": "Done",
                        "value_color": "bg-green-500",
                        "value_date": null,
                        "value_person": null,
                        "item": 133,
                        "column": 51,
                        "id": 183
                    },
                    {
                        "value_text": "",
                        "value_color": "bg-neutral-400",
                        "value_date": null,
                        "value_person": null,
                        "item": 133,
                        "column": 54,
                        "id": 200
                    }
                ],
                [
                    {
                        "value_text": "Working on it",
                        "value_color": "bg-orange-300",
                        "value_date": null,
                        "value_person": null,
                        "item": 132,
                        "column": 51,
                        "id": 182
                    },
                    {
                        "value_text": "",
                        "value_color": "bg-neutral-400",
                        "value_date": null,
                        "value_person": null,
                        "item": 132,
                        "column": 54,
                        "id": 199
                    }
                ]
            ],
            [
                [
                    {
                        "value_text": "",
                        "value_color": "bg-neutral-400",
                        "value_date": null,
                        "value_person": null,
                        "item": 111,
                        "column": 51,
                        "id": 164
                    },
                    {
                        "value_text": "",
                        "value_color": "bg-neutral-400",
                        "value_date": null,
                        "value_person": null,
                        "item": 111,
                        "column": 54,
                        "id": 202
                    }
                ],
                [
                    {
                        "value_text": "Done",
                        "value_color": "bg-green-500",
                        "value_date": null,
                        "value_person": null,
                        "item": 112,
                        "column": 51,
                        "id": 165
                    },
                    {
                        "value_text": "",
                        "value_color": "bg-neutral-400",
                        "value_date": null,
                        "value_person": null,
                        "item": 112,
                        "column": 54,
                        "id": 203
                    }
                ],
                [
                    {
                        "value_text": "",
                        "value_color": "bg-neutral-400",
                        "value_date": null,
                        "value_person": null,
                        "item": 113,
                        "column": 51,
                        "id": 166
                    },
                    {
                        "value_text": "",
                        "value_color": "bg-neutral-400",
                        "value_date": null,
                        "value_person": null,
                        "item": 113,
                        "column": 54,
                        "id": 204
                    }
                ]
            ],
            []
        ],
        "columnsInfo": [
            {
                "name": "Status",
                "column_type": "Status",
                "id": 51,
                "order": 0
            },
            {
                "name": "Status",
                "column_type": "Status",
                "id": 54,
                "order": 1
            }
        ]
    },
    setGroupsData: jest.fn(),
    reloadGroupsInitial: true,
    setReloadGroupsInitial: jest.fn(),
    isItemSelected: false,
    setIsItemSelected: jest.fn(),
    numberOfItemsSelected: '',
    setNumberOfItemsSelected: jest.fn(),
    itemSelected: [],
    setItemSelected: jest.fn(),
    groupsAllSelected: [],
    setGroupsAllSelected: jest.fn(),
    showBoardInfo: false,
    setShowBoardInfo: jest.fn(),
};