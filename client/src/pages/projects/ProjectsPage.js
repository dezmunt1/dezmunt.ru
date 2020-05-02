import React, { useReducer, useCallback, useEffect } from 'react';
import { ProjectsCollapse } from './ProjectsCollapse';
import { ProjectCard } from '../../components/ProjectCard';
import { Spinner } from 'react-bootstrap';
import { useHttp } from '../../hook/http.hook';

function reducer( state, action ) {
  switch (action.type) {
    case 'refresh':
      
      return {...state, ...action.newState};

    case 'toggle':
      const newState = {};
      
      for (let i = 0; i < Object.keys(state).length; i++) {
        const item = Object.keys(state)[i];
        if (item === action.target) {
          newState[ item ] = { ...state[item]};
        }  else {
          newState[ item ] = { ...state[item], open: false }
        }
      };
      newState[action.target] = {...newState[action.target], open: !newState[action.target].open}
      return { ...newState};
    default:
      break;
  }
};

function sortState( state={} ) {
  const sorted = {
    activeList: [],
    waitingList: []
  };

  if( !Object.keys(state).length ) return sorted;

  for (let prop in state) {
    if ( state[prop].open ) {
      sorted.activeList.push(state[prop].project);
    } else {
      sorted.waitingList.push(state[prop].project);
    }
  };
  return sorted;
}

export const ProjectsPage = () => {
  const [open, dispatch] = useReducer( reducer, {} );
  const { request, loading } = useHttp();

  const projectList = localStorage.getItem('allProjects')
    ? JSON.parse( localStorage.getItem('allProjects') )
    : false;
  
  const clickProjectHandler = e  =>  {
    document.querySelector('.active__list').scrollIntoView({block: "start", behavior: "smooth"});
    const target = e.currentTarget.id.slice( e.currentTarget.id.indexOf('-') + 1 );
    dispatch({type: 'toggle', target});
  };

  const getProjectList = useCallback( async () => {
    try {
      if ( projectList ) return null;

      const allProjects = (await request(`/api/projects/getProjects`)).message;
      localStorage.setItem( 'allProjects', JSON.stringify(allProjects));
      dispatch({type: 'refresh', newState: {refresh: (open.refresh && !open.refresh) || true} }) // Refresh UI
      return null;
    } catch (error) {console.log(error)};
  }, [request, projectList, open]);

  const generateProjectList = useCallback( () => {
    const resultList = {};
    const newState = {};

    if ( !projectList ) return resultList;

    projectList.forEach( (project, i) => {
      const openInState = open[project.name] ? open[project.name].open : false;
      const card = <React.Fragment key={i + 1}>
        <ProjectCard
          open = { openInState || project.open }
          name = {project.name}
          projectName = {project.projectName}
          technology = {project.technology}
          clickProjectHandler={clickProjectHandler}
        />
        <ProjectsCollapse open={ openInState || project.open } title={project.name} data={project}/> {/* class = collapse, div in ProjectCard comp */}
      </React.Fragment>;
      if ( !open[project.name] ) newState[project.name] = { open: project.open };
      resultList[project.name] = { open: openInState, project: card};
      return null;
    });
    
    // if created new state
    if ( Object.keys(newState).length ) {
      dispatch({type: 'refresh', newState});
    };
    return resultList;
  }, [open, projectList])

  useEffect( () => {
    getProjectList();
    
  }, [getProjectList]);
  
  const refreshList = generateProjectList();
  const sortProjectList = sortState(refreshList);
  return (
    <div className="container__projects"> 

      {/* HEADER */}
      <div className="wraper__contacts header">
        <p className="header__text">проекты</p>
      </div>
      {/* BODY */}
      <div className="wraper__contacts body__projects">

        <div className="body__projects-text">
          <p>сейчас я работаю над</p>
        </div>

        <div className="body__projects-list">
          <div className="active__list">
            { (loading && <Spinner animation="border"/>) || sortProjectList.activeList }
          </div>
          <div className="waiting__list">
            { (loading && <Spinner animation="border"/>) || sortProjectList.waitingList }
          </div>
            
          
        </div>
      </div>
      {/* INFO */}    
      <div className="wraper__contacts body__info">
      
      </div>
    </div>
  )
}