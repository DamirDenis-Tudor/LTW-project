import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export class DatabaseStack extends cdk.Stack {
  public readonly tables: Record<string, dynamodb.Table> = {};

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    for (const name of ['Projects', 'Users', 'Organizations', 'WorkPackages', 'Deliverables']) {
      this.tables[name] = new dynamodb.Table(this, `${name}Table`, {
        tableName: `LTW_${name}`,
        partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
        billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      });
    }
  }
}
