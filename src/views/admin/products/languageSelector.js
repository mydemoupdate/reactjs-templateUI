/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import clsx from "clsx";
import { Dropdown } from "react-bootstrap";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { toAbsoluteUrl } from "./supportLanguage";
import { DropdownTopbarItemToggler } from "./dropDowntop";

const languages = [
    {
      lang: "en",
      name: "English",
      flag: toAbsoluteUrl("/media/svg/flags/226-united-states.svg"),
    },
  
    {
      lang: "ja",
      name: "Japanese",
      flag: toAbsoluteUrl("/media/svg/flags/063-japan.svg"),
    },
    {
      lang: "vn",
      name: "Việt Nam",
      flag: toAbsoluteUrl("/media/svg/flags/220-vietnam.svg"),
    },
  
  ];


export function LanguageSelectorDropdown() {

  return (
    <Dropdown drop="down" alignRight>
      <Dropdown.Toggle
        as={DropdownTopbarItemToggler}
        id="dropdown-toggle-my-cart"
      >
        <OverlayTrigger
          placement="bottom"
          overlay={
            <Tooltip id="language-panel-tooltip">Select Language</Tooltip>
          }
        >
          <div className="btn btn-icon btn-clean btn-dropdown btn-lg mr-1">
            <img
              className="h-25px w-25px rounded"
              src={toAbsoluteUrl("/media/svg/flags/220-vietnam.svg")}
              alt={"Việt Nam"}
            />
          </div>
        </OverlayTrigger>
      </Dropdown.Toggle>
      <Dropdown.Menu className="p-0 m-0 dropdown-menu-right dropdown-menu-anim dropdown-menu-top-unround">
        <ul className="navi navi-hover py-4">
          {languages.map((language) => (
            <li
              key={language.lang}
              className={clsx("navi-item", {
                active: language.lang === languages.lang,
              })}
            >
              <a
                onClick={() => console.log(language?.lang)}
                className="navi-link"
              >
                <span className="symbol symbol-20 mr-3">
                  <img src={language.flag} alt={language.name} />
                </span>
                <span className="navi-text">{language.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </Dropdown.Menu>
    </Dropdown>
  );
}
