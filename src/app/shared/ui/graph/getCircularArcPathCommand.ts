export function getCircularArcPathCommand({
    centre_x = 100,
    centre_y = 100,
    radius = 100,
    start_angle,
    sweep_angle,
    angle_unit = 'degrees',
}: {
    centre_x?: number;
    centre_y?: number;
    radius?: number;
    start_angle: number;
    sweep_angle: number;
    angle_unit?: string;
}): string {
    if (angle_unit === "radians") {
        // No conversion needed for radians
    } else if (angle_unit === "degrees") {
        start_angle = (start_angle / 180) * Math.PI;
        sweep_angle = (sweep_angle / 180) * Math.PI;
    } else {
        throw new Error(`Unrecognised angle unit: ${angle_unit}`);
    }

    // Work out the start/end points of the arc using trig identities
    const start_x = centre_x + radius * Math.sin(start_angle);
    const start_y = centre_y - radius * Math.cos(start_angle);

    const end_x = centre_x + radius * Math.sin(start_angle + sweep_angle);
    const end_y = centre_y - radius * Math.cos(start_angle + sweep_angle);

    // An arc path in SVG defines an ellipse/curve between two points.
    // The `x_axis_rotation` parameter defines how an ellipse is rotated,
    // if at all, but circles don't change under rotation, so it's irrelevant.
    const x_axis_rotation = 0;

    // For a given radius, there are two circles that intersect the
    // start/end points.
    //
    // The `sweep-flag` parameter determines whether we move in
    // a positive angle (=clockwise) or negative (=counter-clockwise).
    // I'm only doing clockwise sweeps, so this is constant.
    const sweep_flag = 1;

    // There are now two arcs available: one that's more than 180 degrees,
    // one that's less than 180 degrees (one from each of the two circles).
    // The `large-arc-flag` decides which to pick.
    const large_arc_flag = sweep_angle > Math.PI ? 1 : 0;

    return `M ${start_x} ${start_y} A ${radius} ${radius} ${x_axis_rotation} ${large_arc_flag} ${sweep_flag} ${end_x} ${end_y} L ${centre_x} ${centre_y} Z`;
}
