import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { BookmarksComponent } from './pages/bookmarks/bookmarks.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';
import { SearchComponent } from './pages/search/search.component';
import { MessagesComponent } from './pages/messages/messages.component';

export const routes: Routes = [

    

    {path: 'home', 
        loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
    },
    {path: 'bookmarks',
        loadComponent: () => import('./pages/bookmarks/bookmarks.component').then(m => m.BookmarksComponent)
    },
    {path: 'profile/:handle',
        loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent)
    },

    {path: 'search/:query', 
        loadComponent: () => import('./pages/search/search.component').then(m => m.SearchComponent)
    },

    {path: 'search', 
        loadComponent: () => import('./pages/search/search.component').then(m => m.SearchComponent)
    },

    {path: 'search',
        loadComponent: () => import('./pages/search/search.component').then(m => m.SearchComponent)
    },
    {path: 'messages',
        loadComponent: () => import('./pages/messages/messages.component').then(m => m.MessagesComponent)
    },

    {path: 'post',
        loadComponent: () => import('./pages/post/post.component').then(m => m.PostComponent)
    },
    
    {path: 'login', 
        loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
    },

    {path: 'signup',
        loadComponent: () => import('./pages/signup/signup.component').then(m => m.SignupComponent)
    },

    {path: ':handle/:postId', 
        loadComponent: () => import('./pages/tweet/tweet.component').then(m => m.TweetComponent)
    },

    {path: '', redirectTo: '/home', pathMatch: 'full'},
    {path: '**', component: PageNotFoundComponent}
];
