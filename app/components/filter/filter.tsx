import "./filter.css";
import { useState } from "react";
import { CATEGORIES } from "../../../lib/constants";

interface FilterProps {
  filterResources: (category: string) => void;
  filterSheds: (username: string) => void;
  resetFilter: () => void;
  friends: string[];
}

function Filter({ filterResources, filterSheds, resetFilter, friends }: FilterProps) {
  const [typeIsClicked, setTypeIsClicked] = useState<number | null>(null);
  const [friendIsClicked, setFriendIsClicked] = useState<number | null>(null);

  const tags = CATEGORIES;

  function handleTypeClick(el: string, idx: number) {
    if (typeIsClicked === idx) {
      // unselect the checkbox
      setTypeIsClicked(null);
      // reset the filters
      resetFilter();
    } else {
      // select the checkbox
      setTypeIsClicked(idx);
      // apply filter
      filterResources(el);
    }
  }

  function handleFriendClick(el: string, idx: number) {
    if (friendIsClicked === idx) {
      // unselect the checkbox
      setFriendIsClicked(null);
      // reset filters
      resetFilter();
    } else {
      // select the checkbox
      setFriendIsClicked(idx);
      // apply filter
      filterSheds(el);
    }
  }


  function resetFilters() {
    // clear type filter
    setTypeIsClicked(null);
    // clear friend filter
    setFriendIsClicked(null);
    // reset resources to all
    resetFilter();
  }

  return (
    <div className="Filter">
      <p className="Filter-head">filter</p>
      <div className="Filter-category">
        <p className="Filter-title mb-2 text-lg">TYPE</p>
        {tags.map((el, idx) =>
          <div key={idx} className="Filter-tag">
            <input
              id={`checkbox-type-${idx}`}
              type="checkbox"
              checked={typeIsClicked === idx}
              onChange={() => handleTypeClick(el, idx)}
              className="w-4 h-4 text-lime-950 accent-[var(--pink)] bg-gray-100 border-gray-300
              rounded focus:ring-[var(--pink)] dark:focus:ring-[var(--pink)] dark:ring-offset-gray-800
              focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              htmlFor={`checkbox-type-${idx}`}
              className="ms-2 text-m font-medium"
            >
              {el}
            </label>
          </div>)}
      </div>
      <div className="Filter-friends">
        <p className="Filter-title mb-2 text-lg">FRIENDS</p>
        {friends.map((el, idx) =>
          <div key={idx} className="Filter-tag">
            <input
              id={`checkbox-friend-${idx}`}
              type="checkbox"
              checked={friendIsClicked === idx}
              onChange={() => handleFriendClick(el, idx)}
              className="w-4 h-4 text-blue-600 accent-[var(--pink)] bg-gray-100 border-gray-300
              rounded focus:ring-[var(--pink)] dark:focus:ring-[var(--pink)] dark:ring-offset-gray-800
              focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              htmlFor={`checkbox-friend-${idx}`}
              className="ms-2 text-m font-medium"
            >
              {el}
            </label>
          </div>)}
      </div>
      <button type="button" className="Filter-reset"
        onClick={() => resetFilters()}>reset filters</button>
    </div>
  );
}

export default Filter;