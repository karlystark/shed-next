"use client";

import React from 'react';
import ResourceCard from "../components/resourceCard/resourceCard";
import Filter from "../components/filter/filter";
import "./resources.css";
import { useState } from "react";

const resources = [
  {
    id: 1,
    user: "karlystark",
    user_img: "ksnpr.JPG",
    title: "hand saw",
    description: "7 inch corona foldable hand saw with a safety latch.",
    image: "corona.jpg",
    alt: "a foldable handsaw against a white background",
    category: "tools",
    quantity: 1
  },
  {
    id: 2,
    user: "karlystark",
    user_img: "ksnpr.JPG",
    title: "focusrite scarlett 2i2 interface",
    description: "a music production interface with two XLR inputs. ",
    image: "scarlett.jpeg",
    alt: "a scarlett interface",
    category: "tech",
    quantity: 1
  },
  {
    id: 3,
    user: "karlystark",
    user_img: "ksnpr.jpg",
    title: "spice cake slices",
    description: "I made a cake! Please eat some! It's spice cake with mascarpone whipped cream frosting and raspberry jam.",
    image: "cake.jpeg",
    alt: "a slice of spice cake on a plate",
    category: "foods",
    quantity: 3
  },
  {
    id: 4,
    user: "karlystark",
    user_img: "ksnpr.jpg",
    title: "pet care",
    description: "I can feed your cat or hang with your dog any time you're away! My job is basically cats!",
    image: "darla.jpeg",
    alt: "darla licks karly's face as they sit on a porch",
    category: "services",
    quantity: 1
  },
  {
    id: 5,
    user: "karlystark",
    user_img: "ksnpr.jpg",
    title: "REI Passage 2 tent",
    description: "A two-person REI Passage 2 tent. It works well for two but is really roomy and great for one.",
    image: "passage2.jpeg",
    alt: "a passage 2 tent sits in a field",
    category: "outdoors",
    quantity: 1
  },
  {
    id: 6,
    user: "karlystark",
    user_img: "ksnpr.jpg",
    title: "wooden spoons",
    description: "I whittle so many of these, have some!",
    image: "spoons.jpeg",
    alt: "a collection of hand carved wooden spoons on a table",
    category: "tools",
    quantity: 10
  },

];

function Resources() {
  const [filteredResources, setFilteredResources] = useState(resources);

  console.log("filteredResources=", filteredResources);

  function filterSheds(username) {
    if(username === null){
      resetFilter();
    } else {
    const filteredSheds = resources.filter(resource => resource.user === username);
    setFilteredResources(filteredSheds);
    }
  }

  function filterResources(type) {
    if(type === null){
      resetFilter();
    } else {
    const filteredItems = resources.filter(resource => resource.category === type);
    setFilteredResources(filteredItems);
    }
  }

  function resetFilter() {
    setFilteredResources(resources);
  }

  return (
    <div className="ResourceList">
      <div className="ResourceList-banner">
        {/* <img src="sun.png" alt="" /> */}
        <h1 className="ResourceList-banner-title"> shared resources </h1>
        {/* <img src="carrots.png" alt="" /> */}
      </div>
      <div className="ResourceList-body">
        <Filter
          filterResources={filterResources}
          filterSheds={filterSheds}
          resetFilter={resetFilter}
        />
        <div className="ResourceList-list">
          {filteredResources.map((resource, idx) =>
            <ResourceCard key={idx} resource={resource} />)}
        </div>
      </div>
    </div>
  );
}

export default Resources;
