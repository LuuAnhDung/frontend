import { IBase } from './base.type';
import { ICourse } from './course.type';
import { ILesson } from './lesson.type';
import { User } from './note.type';
import { IUser } from './user.type';


export interface IDiscuss extends IBase {
  //code: string;
  _id: string;
  //lessonId: ILesson;
  courseId: string;
  // courseId: ICourse;
  userId: IUser;
  //userId: string;
  comment: string;
  //parentDiscussId: string | null;
  discussId: string;
  replies: IReply[];
}

export interface IReply extends IBase {
  _id: string;
  userId: User;
  comment: string;
  courseId: string;
  lessonId: string;
}
