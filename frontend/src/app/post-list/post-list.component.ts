import { Component, OnInit } from '@angular/core';
import { PostsService } from '../services/posts.service';
import { catchError, Observable, of, tap, take, switchMap, EMPTY } from 'rxjs';
import { Post } from '../models/Post.model';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
})
export class PostListComponent implements OnInit {
  posts$!: Observable<Post[]>;
  errorMsg!: string;
  //username$!: Observable<Post[]>;
  userId!: string;
  admin!: string;
  username!: string;
  createdDate!: Date;
  constructor(
    private post: PostsService,
    private router: Router,
    private auth: AuthService
  ) {}

  ngOnInit() {
    //this.username =
    //this.admin = ;
    this.userId = this.auth.getUserId();
    this.posts$ = this.post.posts$.pipe(
      tap(() => {
        this.errorMsg = '';
      }),
      catchError((error) => {
        this.errorMsg = JSON.stringify(error);
        return of([]);
      })
    );
    this.post.getPosts();
  }

  onClickPost(id: string) {
    this.router.navigate(['post', id]);
  }

  onModify(id: string) {
    this.posts$
      .pipe(
        take(1),
        tap((post) => this.router.navigate(['/modify-post', id]))
      )
      .subscribe();
  }

  // onDelete(id: string) {
  //   this.posts$
  //     .pipe(
  //       take(1),
  //       switchMap((post) => this.posts$.deletePost(id)),
  //       tap((message) => {
  //         console.log(message);
  //         this.router.navigate(['/posts']);
  //       }),
  //       catchError((error) => {
  //         //this.errorMessage = error.message;
  //         console.error(error);
  //         return EMPTY;
  //       })
  //     )
  //     .subscribe();
  // }

  // onLike() {
  //   if (this.disliked) {
  //     return;
  //   }
  //   this.likePending = true;
  //   this.post$
  //     .pipe(
  //       take(1),
  //       switchMap((post: Post) =>
  //         this.posts.likePost(post._id, !this.liked).pipe(
  //           tap((liked) => {
  //             this.likePending = false;
  //             this.liked = liked;
  //           }),
  //           map((liked) => ({
  //             ...post,
  //             likes: liked ? post.likes + 1 : post.likes - 1,
  //           })),
  //           tap((post) => (this.post$ = of(post)))
  //         )
  //       )
  //     )
  //     .subscribe();
  // }

  // onDislike() {
  //   if (this.liked) {
  //     return;
  //   }
  //   this.likePending = true;
  //   this.post$
  //     .pipe(
  //       take(1),
  //       switchMap((post: Post) =>
  //         this.posts.dislikePost(post._id, !this.disliked).pipe(
  //           tap((disliked) => {
  //             this.likePending = false;
  //             this.disliked = disliked;
  //           }),
  //           map((disliked) => ({
  //             ...post,
  //             dislikes: disliked ? post.dislikes + 1 : post.dislikes - 1,
  //           })),
  //           tap((post) => (this.post$ = of(post)))
  //         )
  //       )
  //     )
  //     .subscribe();
  // }
}
