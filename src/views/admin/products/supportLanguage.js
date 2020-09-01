import React, {createContext} from "react";
import {useMemo} from "react";
import {useContext} from "react";

export const toAbsoluteUrl = pathname => process.env.PUBLIC_URL + pathname;
