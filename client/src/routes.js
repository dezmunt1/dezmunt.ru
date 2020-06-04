import React from 'react';
// Content
import { Route, Switch } from 'react-router-dom';
import { MainPage } from './pages/MainPage';
import { BlogPage } from './pages/blog/BlogPage';
import { BlogOpenPage } from './pages/blog/BlogOpenPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { ProjectsPage } from './pages/projects/ProjectsPage';
import { ContactsPage } from './pages/ContactsPage';
import { AuthorPage } from './pages/AuthorPage';
// OverSize
import { CreateBlog } from './pages/CreateBlog';
import { CreateBlogForm } from './pages/blog/createblog/CreateBlogForm';
import { EditBlogForm } from './pages/blog/createblog/EditBlogForm';


export const useRoutes = typeRoutes => {

  switch ( typeRoutes ) {
    case 'content':
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
      );
    case 'overscreen':
      return (
        <Switch>
          <Route path="/blog/createblog" exact>
            <CreateBlog />
          </Route>
          <Route path="/blog/createblog/new/:authorname/:authorid">
            <CreateBlogForm />
          </Route>
          <Route path="/blog/createblog/edit/:authorname/:authorid">
            <EditBlogForm />
          </Route>
        </Switch>
      );
    default:
      break
      
  }

}