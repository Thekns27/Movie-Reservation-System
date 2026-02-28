import { title } from "process";
import { duration } from "zod/v4/classic/iso.cjs";


export interface MovieProps {
  id?: string;
  title: string;
  genre: string;
  actors: string[];
  duration: number;
  description?: string | null;
  isActive: boolean;
}

export class Movie {
  private constructor(private props: MovieProps) {}

  static create(props: MovieProps): Movie{
    return new Movie({
        id: props.id,
        title: props.title,
        genre: props.genre,
        actors: props.actors,
        duration: props.duration,
        description: props.description!,
        isActive: props.isActive ?? true,
    });
  }

  toPrimitives() {
    return {
        id: this.props.id,
        title:this.props.title,
        genre: this.props.genre,
        actors:this.props.actors,
        duration:this.props.duration,
        description:this.props.description!,
        isActive: this.props.isActive,
    };
  }

  deactivate() {
    this.props.isActive = false;
  }
}
