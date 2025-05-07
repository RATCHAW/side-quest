export interface Resource {
  type: string;
  title: string;
  url: string;
}

export interface Reply {
  id: string;
  author: string;
  avatar: string;
  content: string;
  date: string;
}

export interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  date: string;
  replies: Reply[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  author: string;
  date: string;
  image?: string;
  votes: number;
  comments: Comment[];
  resources: Resource[];
}
