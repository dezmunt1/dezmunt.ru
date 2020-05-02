import React from 'react';
import { textFormater } from '../utils/textFormater'

export const ProjectCard = props => {
  
  return (
    <div
      className="projects__card-item"
      onClick={ props.clickProjectHandler }
      aria-controls="example-collapse-text"
      aria-expanded={props.open || ""}
      id = {`projects-${props.name}`}
    >
      <div className="item-logo">
        <div className={`item-logo-img`} style={{backgroundImage: "url('../img/projects/" + props.name + ".png')"}} />
      </div>
      <div className="item-info">
        <p className="project-name">{props.projectName}</p>
        <p className="project-technology">{textFormater({type: 'shortString', data: props.technology, maxLength: 25})}</p>
      </div>
    </div>
  )

}