import { Component, OnInit } from '@angular/core';
import { Post } from '../models/Post.model';
import { PostsService } from '../services/posts.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import {
  catchError,
  EMPTY,
  map,
  Observable,
  of,
  switchMap,
  take,
  tap,
} from 'rxjs';

@Component({
  selector: 'app-single-post',
  templateUrl: './single-post.component.html',
  styleUrls: ['./single-post.component.scss'],
})
export class SinglePostComponent implements OnInit {
  post$!: Observable<Post>;
  userId!: string;
  likePending!: boolean;
  liked!: boolean;
  disliked!: boolean;
  errorMessage!: string;
  //admin!: string;
  //createdDate!: Date;

  constructor(
    private posts: PostsService,
    private route: ActivatedRoute,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.userId = this.auth.getUserId();
    this.post$ = this.route.params.pipe(
      map((params) => params['id']),
      switchMap((id) => this.posts.getPostById(id)),
      tap((post) => {
        if (post.usersLiked.find((user) => user === this.userId)) {
          this.liked = true;
        } else if (post.usersDisliked.find((user) => user === this.userId)) {
          this.disliked = true;
        }
      })
    );
  }

  onLike() {
    if (this.disliked) {
      return;
    }
    this.likePending = true;
    this.post$
      .pipe(
        take(1),
        switchMap((post: Post) =>
          this.posts.likePost(post._id, !this.liked).pipe(
            tap((liked) => {
              this.likePending = false;
              this.liked = liked;
            }),
            map((liked) => ({
              ...post,
              likes: liked ? post.likes + 1 : post.likes - 1,
            })),
            tap((post) => (this.post$ = of(post)))
          )
        )
      )
      .subscribe();
  }

  onDislike() {
    if (this.liked) {
      return;
    }
    this.likePending = true;
    this.post$
      .pipe(
        take(1),
        switchMap((post: Post) =>
          this.posts.dislikePost(post._id, !this.disliked).pipe(
            tap((disliked) => {
              this.likePending = false;
              this.disliked = disliked;
            }),
            map((disliked) => ({
              ...post,
              dislikes: disliked ? post.dislikes + 1 : post.dislikes - 1,
            })),
            tap((post) => (this.post$ = of(post)))
          )
        )
      )
      .subscribe();
  }

  onBack() {
    this.router.navigate(['/posts']);
  }

  onModify() {
    this.post$
      .pipe(
        take(1),
        tap((post) => this.router.navigate(['/modify-post', post._id]))
      )
      .subscribe();
  }

  onDelete() {
    this.post$
      .pipe(
        take(1),
        switchMap((post) => this.posts.deletePost(post._id)),
        tap((message) => {
          console.log(message);
          this.router.navigate(['/posts']);
        }),
        catchError((error) => {
          this.errorMessage = error.message;
          console.error(error);
          return EMPTY;
        })
      )
      .subscribe();
  }
}
