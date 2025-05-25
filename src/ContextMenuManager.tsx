import React, { createContext, useContext, useReducer } from "react";

export type MenuItemType = "item" | "separator" | "submenu" | "themeSwitcher";

interface BaseItem {
  id: string;
  type: MenuItemType;
}

interface MenuItem extends BaseItem {
  label?: string;
  onClick?: () => void;
  items?: MenuItem[];
  className?: string;
}

type State = MenuItem[];

type Action =
  | { type: "ADD_ITEM"; payload: MenuItem }
  | { type: "REMOVE_ITEM"; payload: { id: string } }
  | { type: "CLEAR_ITEMS" };

const ContextMenuContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
}>({
  state: [],
  dispatch: () => {},
});

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD_ITEM":
      return [...state, action.payload];
    case "REMOVE_ITEM":
      return state.filter((item) => item.id !== action.payload.id);
    case "CLEAR_ITEMS":
      return [];
    default:
      return state;
  }
}

export const ContextMenuProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(reducer, []);
  return (
    <ContextMenuContext.Provider value={{ state, dispatch }}>
      {children}
    </ContextMenuContext.Provider>
  );
};

export const useContextMenuManager = () => useContext(ContextMenuContext);
