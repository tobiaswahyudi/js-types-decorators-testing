import { Boolean, Number, Literal, Tuple, Union, Record } from 'runtypes';

export const Vector = Tuple(Number, Number, Number);

export const Asteroid = Record({
  type: Literal('asteroid'),
  location: Vector,
  mass: Number,
});

export const Planet = Record({
  type: Literal('planet'),
  location: Vector,
  mass: Number,
  population: Number,
  habitable: Boolean,
});

export const SpaceObject = Union(Asteroid, Planet);
