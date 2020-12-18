import { Boolean, Number, Static } from 'runtypes';
import { Planet, SpaceObject } from './listing-2-3';
import { ValidateRTypes, RType } from './decorators';

class SpaceTelescope {

  @ValidateRTypes(Boolean)
  static isPlanetHabitable(@RType(Planet) object: Static<typeof Planet>): boolean {
    return object.habitable;
  }

  @ValidateRTypes(Number)
  static fuelNeededToReach(@RType(SpaceObject) object: Static<typeof SpaceObject>): number {
    console.log("Calculating Fuel...");
    return Math.hypot(object.location[0], object.location[1s], object.location[2]);
  }

  @ValidateRTypes(Number)
  static bigRocketFuelNeededToReach(@RType(SpaceObject) object: Static<typeof SpaceObject>): number {
    return 3 * this.fuelNeededToReach(object);
  }
}

const notASpaceObject = JSON.parse('{ "name":"Bob", "age": 42 }');

try {
  console.log(SpaceTelescope.bigRocketFuelNeededToReach(notASpaceObject))
} catch (e) {
  console.log(e)
}
/* ValidationError:
    Expected { type: "asteroid"; location: [number, number, number]; mass: number; } | { type: "planet"; location: [number, number, number]; mass: number; population: number; habitable: boolean; }, but was object
*/
// Doesn't print "Calculating Fuel" !

try {
  console.log(SpaceTelescope.isPlanetHabitable(notASpaceObject))
} catch (e) {
  console.log(e)
}
/* ValidationError:
    Expected literal 'planet', but was 'undefined' in type
*/
