export class Post {
  _id!: string;
  username!: string;
  createdDate!: Date;
  description!: string;
  likes!: number;
  dislikes!: number;
  imageUrl!: string;
  usersLiked!: string[];
  usersDisliked!: string[];
  userId!: string;
}
