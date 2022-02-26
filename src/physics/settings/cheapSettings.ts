import md from "minecraft-data";
import { Entity } from "prismarine-entity";
import { IPhysics } from "../engines/IPhysics";

type BubbleColumnInfo = {
    down: number;
    maxDown: number;
    up: number;
    maxUp: number;
};

export class PhysicsSettings {
    public static mcData: md.IndexedData;
    public static readonly entityData = PhysicsSettings.mcData["entitiesByName"];
    public static readonly mobData = PhysicsSettings.mcData["mobs"];

    public static yawSpeed: number = 3.0;
    public static pitchSpeed: number = 3.0;
    public static playerSpeed: number = 0.1;
    public movementSpeedAttribute: any; //dunno yet
    public static stepHeight: number = 0.6; // how much height can the bot step on without jump
    public static negligeableVelocity: number = 0.003; // actually 0.005 for 1.8; but seems fine
    public static soulsandSpeed: number = 0.4;
    public static honeyblockSpeed: number = 0.4;
    public static honeyblockJumpSpeed: number = 0.4;
    public static ladderMaxSpeed: number = 0.15;
    public static ladderClimbSpeed: number = 0.2;
    public static waterInertia: number = 0.8;
    public static lavaInertia: number = 0.5;
    public waterGravity: number;
    public lavaGravity: number;
    public liquidAcceleration: number = 0.02;
    public static defaultSlipperiness: number = 0.6;
    public static outOfLiquidImpulse: number = 0.3;
    public static autojumpCooldown: number = 10; // ticks (0.5s)
    public static bubbleColumnSurfaceDrag: BubbleColumnInfo = {
        down: 0.03,
        maxDown: -0.9,
        up: 0.1,
        maxUp: 1.8,
    };
    public static bubbleColumnDrag: BubbleColumnInfo = {
        down: 0.03,
        maxDown: -0.3,
        up: 0.06,
        maxUp: 0.7,
    };
    public static slowFalling: number = 0.125;
    public static sprintingUUID: string = "662a6b8d-da3e-4c1c-8813-96ea6097278d"; // SPEED_MODIFIER_SPRINTING_UUID is from LivingEntity.java
    public static jumpHeight: number = Math.fround(0.42);

    constructor(
        public ctx: IPhysics,
        public gravity: number,
        public terminalVelocity: number,
        public airdrag: number,
        public airborneInertia: number,
        public airborneAcceleration: number,
        public dragAfterAcceleration: boolean = false,
        public useControls: boolean = false,
        public sprintSpeed: number = 0.3,
        public sneakSpeed: number = 0.3,
        public usingItemSpeed: number = 0.2
    ) {
        this.movementSpeedAttribute = (ctx.data.attributesByName.movementSpeed as any).resource;

        if (ctx.supportFeature("independentLiquidGravity")) {
            this.waterGravity = 0.02;
            this.lavaGravity = 0.02;
        } else if (ctx.supportFeature("proportionalLiquidGravity")) {
            this.waterGravity = this.gravity / 16;
            this.lavaGravity = this.gravity / 4;
        } else {
            this.waterGravity = 0.005;
            this.lavaGravity = 0.02;
        }
    }

    // entities: IndexedData["entitiesByName"],
    //TODO: Perhaps get from type? Import indexedData to do it?
    public static FROM_ENTITY(ctx: IPhysics, baseEntity: Entity) {
        switch (baseEntity.type) {
            case "player":
                return new PhysicsSettings(ctx, 0.08, 3.92, Math.fround(1 - 0.02), 0.91, 0.02, true, true);
            case "mob":
                return new PhysicsSettings(ctx, 0.08, 3.92, Math.fround(1 - 0.02), 0.91, 0.02);
            case "orb":
                return new PhysicsSettings(ctx, 0.03, 1.5, Math.fround(1 - 0.02), 0.91, 0.02);
            case "other":
                if (baseEntity.name?.includes("block") || baseEntity.name?.includes("tnt")) {
                    return new PhysicsSettings(ctx, 0.04, 2.0, Math.fround(1 - 0.02), 0.91, 0.02);
                } else if (baseEntity.name?.includes("minecart")) {
                    return new PhysicsSettings(ctx, 0.04, 0.76, Math.fround(1 - 0.05), 0.91, 0.02);
                } else if (baseEntity.name?.includes("boat")) {
                    return new PhysicsSettings(ctx, 0.04, Infinity, 0, 0.91, 0.02);
                } else if (
                    baseEntity.name?.includes("egg") ||
                    baseEntity.name?.includes("snowball") ||
                    baseEntity.name?.includes("potion") ||
                    baseEntity.name?.includes("pearl")
                ) {
                    return new PhysicsSettings(ctx, 0.03, 3.0, Math.fround(1 - 0.01), 0.91, 0.02);
                } else if (baseEntity.name?.includes("orb")) {
                    return new PhysicsSettings(ctx, 0.03, 1.5, Math.fround(1 - 0.02), 0.91, 0.02);
                } else if (baseEntity.name?.includes("bobber")) {
                    return new PhysicsSettings(ctx, 0.03, 0.375, Math.fround(1 - 0.08), 0.91, 0.02);
                } else if (baseEntity.name?.includes("spit")) {
                    return new PhysicsSettings(ctx, 0.06, 6.0, Math.fround(1 - 0.01), 0.91, 0.02);
                } else if (baseEntity.name?.includes("arrow") || baseEntity.name?.includes("trident")) {
                    return new PhysicsSettings(ctx, 0.05, 5.0, Math.fround(1 - 0.01), 0.91, 0.02);
                } else if (baseEntity.name?.includes("fireball") || baseEntity.name?.includes("skull")) {
                    return new PhysicsSettings(ctx, 0.0, 1.9, Math.fround(1 - 0.05), 0.91, 0.02, true);
                }
        }
    }

    public static FROM_MD_ENTITY(ctx: IPhysics, mdEntity: md.Entity) {

        if (mdEntity.type === "player" || !!PhysicsSettings.mobData[mdEntity.id]) {
            return new PhysicsSettings(ctx, 0.08, 3.92, Math.fround(1 - 0.02), 0.91, 0.02, true, true);
        }
        switch (mdEntity.type) {
            case "player":
                return new PhysicsSettings(ctx, 0.08, 3.92, Math.fround(1 - 0.02), 0.91, 0.02, true, true);
            case "mob":
                return new PhysicsSettings(ctx, 0.08, 3.92, Math.fround(1 - 0.02), 0.91, 0.02);
            case "orb":
                return new PhysicsSettings(ctx, 0.03, 1.5, Math.fround(1 - 0.02), 0.91, 0.02);
            case "other":
                if (mdEntity.name?.includes("block") || mdEntity.name?.includes("tnt")) {
                    return new PhysicsSettings(ctx, 0.04, 2.0, Math.fround(1 - 0.02), 0.91, 0.02);
                } else if (mdEntity.name?.includes("minecart")) {
                    return new PhysicsSettings(ctx, 0.04, 0.76, Math.fround(1 - 0.05), 0.91, 0.02);
                } else if (mdEntity.name?.includes("boat")) {
                    return new PhysicsSettings(ctx, 0.04, Infinity, 0, 0.91, 0.02);
                } else if (
                    mdEntity.name?.includes("egg") ||
                    mdEntity.name?.includes("snowball") ||
                    mdEntity.name?.includes("potion") ||
                    mdEntity.name?.includes("pearl")
                ) {
                    return new PhysicsSettings(ctx, 0.03, 3.0, Math.fround(1 - 0.01), 0.91, 0.02);
                } else if (mdEntity.name?.includes("orb")) {
                    return new PhysicsSettings(ctx, 0.03, 1.5, Math.fround(1 - 0.02), 0.91, 0.02);
                } else if (mdEntity.name?.includes("bobber")) {
                    return new PhysicsSettings(ctx, 0.03, 0.375, Math.fround(1 - 0.08), 0.91, 0.02);
                } else if (mdEntity.name?.includes("spit")) {
                    return new PhysicsSettings(ctx, 0.06, 6.0, Math.fround(1 - 0.01), 0.91, 0.02);
                } else if (mdEntity.name?.includes("arrow") || mdEntity.name?.includes("trident")) {
                    return new PhysicsSettings(ctx, 0.05, 5.0, Math.fround(1 - 0.01), 0.91, 0.02);
                } else if (mdEntity.name?.includes("fireball") || mdEntity.name?.includes("skull")) {
                    return new PhysicsSettings(ctx, 0.0, 1.9, Math.fround(1 - 0.05), 0.91, 0.02, true);
                }
        }

    }
}