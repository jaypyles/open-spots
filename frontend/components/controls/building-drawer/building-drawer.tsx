"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  formatTime,
  roundDistanceToHundreds,
  sliceString,
  type MapData,
} from "@/lib";
import { clsx } from "clsx";
import classes from "./building-drawer.module.css";

export const statusLabel = (status: string) => {
  return (
    <div
      className={clsx("rounded-lg px-2 py-1 text-sm w-[fit-content]", {
        [classes["available-label"]]: status === "available",
        [classes["unavailable-label"]]: status === "unavailable",
        [classes["upcoming-label"]]: status === "upcoming",
      })}
    >
      {status}
    </div>
  );
};

function statusIndicator(status: string) {
  return (
    <div
      className={clsx("h-2 w-2 rounded-full", {
        [classes.available]: status === "available",
        [classes.unavailable]: status === "unavailable",
        [classes.upcoming]: status === "upcoming",
      })}
    />
  );
}

export type BuildingDrawerProps = {
  data: MapData[];
  activeBuilding: string | null;
  setActiveBuilding: (building: string) => void;
};

export const BuildingDrawer = ({
  data,
  activeBuilding,
  setActiveBuilding,
}: BuildingDrawerProps) => {
  const getBuildingType = (building: MapData) => {
    if (!building.labels) {
      return null;
    }

    return building.labels.map((label) => (
      <div
        className={classes.tag}
        style={{ backgroundColor: label.color }}
        key={label.label}
      >
        {label.label}
      </div>
    ));
  };

  return (
    <div className="px-8">
      <Accordion
        type="single"
        collapsible
        className="w-full"
        value={activeBuilding || ""}
        onValueChange={(val) => setActiveBuilding(val)}
      >
        {data.map((building) => (
          <AccordionItem
            id={building.building_code}
            value={building.building_code}
            key={building.building_code}
            className=""
          >
            <AccordionTrigger>
              <div className="flex justify-between w-[95%] text-left text-lg group items-center">
                <div className="pr-2">
                  <div className="flex items-center gap-2">
                    <div className="group-hover:underline underline-offset-8">
                      {building.building}
                    </div>
                    <div className={classes.tags}>
                      {getBuildingType(building)}
                    </div>
                  </div>
                  <div className={classes.distance}>
                    {roundDistanceToHundreds(building.distance)}{" "}
                    {building.distance_unit}
                  </div>
                </div>
                <div>{statusLabel(building.building_status)}</div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="divide-y divide-dashed divide-zinc-600">
              {building.rooms &&
                Object.entries(building.rooms).map(([roomNumber, room]) => {
                  return (
                    <div
                      key={roomNumber}
                      className="flex justify-between py-4 text-lg font-[family-name:var(--font-geist-mono)] text-[16px]"
                    >
                      <div className="flex gap-4 items-center h-[fit-content]">
                        <div className="w-18 max-md:text-sm">
                          <div>
                            {sliceString(
                              `${building.building_code} ${room.roomNumber}`,
                              60
                            )}
                          </div>
                        </div>
                        <div className="relative">
                          {room.slots && room.slots.length > 0 ? (
                            statusIndicator(room.slots[0].Status)
                          ) : (
                            <div className="text-gray-500">
                              No slots available
                            </div>
                          )}
                        </div>
                      </div>
                      <ul className="text-right">
                        {room.slots && room.slots.length > 0 ? (
                          room.slots.map((slot, index) => (
                            <li key={index} className="max-md:text-sm">
                              {formatTime(slot.StartTime)} -{" "}
                              {formatTime(slot.EndTime)}
                            </li>
                          ))
                        ) : (
                          <li>No slots available</li>
                        )}
                      </ul>
                    </div>
                  );
                })}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};
