import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { MainPage } from './pages/MainPage';
import { BlogPage } from './pages/blog/BlogPage';
import { BlogOpenPage } from './pages/blog/BlogOpenPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { ProjectsPage } from './pages/projects/ProjectsPage';
import { ContactsPage } from './pages/ContactsPage';
import { AuthorPage } from './pages/AuthorPage';


export const useRoutes = () => {
  return (
    <Switch>
      <Route path="/" exact>
        <MainPage />
      </Route>
      <Route path="/blog" exact>
        <BlogPage />
      </Route>
      <Route path="/blog/article/:id">
        <BlogOpenPage />
      </Route>
      <Route path="/authors/:id">
        <AuthorPage />
      </Route>
      <Route path="/contacts" exact>
        <ContactsPage />
      </Route>
      <Route path="/portfolio" exact>
        <PortfolioPage />
      </Route>
      <Route path="/projects" exact>
        <ProjectsPage />
      </Route>
    </Switch>
  )
}